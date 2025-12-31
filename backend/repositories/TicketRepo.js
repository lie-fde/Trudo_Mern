import mongoose from "mongoose";
import Tickets from "../models/Ticket.js";
import Events from "../models/Events.js";

export const lockTicketRepo = async ({
  userId,
  eventId,
  quantity,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const event = await Events.findById(eventId).session(session);
    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const now = new Date();

    const reserved = await Tickets.aggregate([
      {
        $match: {
          eventId: event._id,
          $or: [
            { status: "Active" },
            {
              status: "Locked",
              bookingLockExpires: { $gt: now },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
        },
      },
    ]).session(session);

    const booked = reserved[0]?.total || 0;
    const available = event.totalTickets - booked;

    if (available < quantity) {
      throw new Error(`NOT_ENOUGH_TICKETS:${available}`);
    }

    const lockExpiry = new Date(Date.now() + 2 * 60 * 1000);

    const [ticket] = await Tickets.create(
      [
        {
          userId,
          eventId,
          quantity,
          status: "Locked",
          bookingLockExpires: lockExpiry,
          expiresAt: new Date(
            new Date(event.date).getTime() +
              event.duration * 60 * 1000
          ),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      ticketId: ticket._id,
      lockExpiresAt: lockExpiry,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};



export const getEventWithRemainingTicketsRepo = async (eventId) => {
  const event = await Events.findById(eventId).lean();
  if (!event) return null;

  const now = new Date();

  const reserved = await Tickets.aggregate([
    {
      $match: {
        eventId: event._id,
        $or: [
          { status: "Active" },
          { status: "Locked", bookingLockExpires: { $gt: now } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$quantity" },
      },
    },
  ]);

  const booked = reserved[0]?.total || 0;

  return {
    remainingTickets: event.totalTickets - booked,
  };
};


export const getTicketsByStatus = (userId, status) => {
  return Tickets.find({ userId, status })
    .populate("eventId")
    .sort({ createdAt: -1 });
};





export const getAdminEventReport = async ({
  skip = 0,
  limit = 6,
  search,
  eventTitle,
  from,
  to,
}) => {

  const andConditions = [];

  // ---------------- DATE FILTER (Ticket.createdAt) ----------------
  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gte = from;
    if (to) createdAt.$lte = to;
    andConditions.push({ createdAt });
  }

  andConditions.push({
  status: { $ne: "Locked" },
});

  const pipeline = [
    ...(andConditions.length ? [{ $match: { $and: andConditions } }] : []),

    // ---------------- JOIN EVENTS ----------------
    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },

    // ---------------- JOIN USERS ----------------
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // ---------------- JOIN PAYMENTS ----------------
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "razorpayPaymentId",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  const postMatchAnd = [];

  // ---------------- SEARCH FILTER ----------------
  if (search) {
    postMatchAnd.push({
      $or: [
        { "event.title": { $regex: search, $options: "i" } },
        { "user.userName": { $regex: search, $options: "i" } },
        { "user.userEmail": { $regex: search, $options: "i" } },
      ],
    });
  }

  // ---------------- EVENT DROPDOWN FILTER ----------------
  if (eventTitle) {
    postMatchAnd.push({
      "event.title": { $regex: eventTitle, $options: "i" },
    });
  }

  if (postMatchAnd.length) {
    pipeline.push({ $match: { $and: postMatchAnd } });
  }

  // ---------------- SORT LATEST FIRST ----------------
  pipeline.push({ $sort: { createdAt: -1 } });

  // ---------------- PAGINATION + TOTAL COUNT ----------------
  pipeline.push({
    $facet: {
      data: [
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 0,

            // Mandatory fields
            eventName: "$event.title",
            userEmail: "$user.userEmail",
            userName: "$user.userName",
            ticketStatus: "$status",
            numberOfTickets: "$quantity",
            date: "$createdAt",
            amount: "$payment.amount",

            // Optional (can remove if not needed)
            ticketId: "$_id",
            eventId: "$event._id",
            paymentId: "$payment.razorpayPaymentId",
          },
        },
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await Tickets.aggregate(pipeline);

  const data = result?.[0]?.data || [];
  const total = result?.[0]?.totalCount?.[0]?.count || 0;

  return { data, total };
};




export const EventReportStatsRepo = async () => {
  const [
    TotalEvents,
    TotalActiveEvents,
    totalRegistrationsAgg,
    totalRevenueAgg,
  ] = await Promise.all([
    // ---------------- TOTAL EVENTS ----------------
    Events.countDocuments({
      isDeleted: false,
    }),

    // ---------------- TOTAL ACTIVE EVENTS ----------------
    Events.countDocuments({
      status: "Approved",
      isDeleted: false,
      isBlocked: false,
    }),

    // ---------------- TOTAL REGISTRATIONS (Tickets sold) ----------------
    Tickets.aggregate([
      {
        $match: {
          status: { $in: ["Active", "Expired"] },
        },
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$quantity" },
        },
      },
    ]),

    // ---------------- TOTAL REVENUE ----------------
    Tickets.aggregate([
      {
        $match: {
          status: { $in: ["Active", "Expired"] }, // 👈 key change
          paymentId: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "razorpayPaymentId",
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "payment.paymentStatus": "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$payment.amount" },
        },
      },
    ]),
  ]);

  const TotalRegistrations =
    totalRegistrationsAgg?.[0]?.totalTickets || 0;

  const TotalRevenue =
    totalRevenueAgg?.[0]?.totalRevenue || 0;

  return {
    TotalEvents,
    TotalActiveEvents,
    TotalRegistrations,
    TotalRevenue,
  };
};



export const exportAdminEvents = async ({
  search,
  eventTitle,
  from,
  to,
}) => {
  const andConditions = [];

  // ---------------- DATE FILTER (Ticket.createdAt) ----------------
  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gte = from;
    if (to) createdAt.$lte = to;
    andConditions.push({ createdAt });
  }

  const pipeline = [
    ...(andConditions.length ? [{ $match: { $and: andConditions } }] : []),

    // ---------------- JOIN EVENTS ----------------
    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },

    // ---------------- JOIN PAYMENTS ----------------
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "razorpayPaymentId",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true,
      },
    },

    // ---------------- JOIN USERS ----------------
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  // ---------------- SEARCH FILTER ----------------
  const postMatchAnd = [];

  if (search) {
    postMatchAnd.push({
      $or: [
        { "event.title": { $regex: search, $options: "i" } },
        { "user.userName": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ],
    });
  }

  if (eventTitle) {
    postMatchAnd.push({
      "event.title": { $regex: eventTitle, $options: "i" },
    });
  }

  if (postMatchAnd.length) {
    pipeline.push({ $match: { $and: postMatchAnd } });
  }

  // ---------------- SORT LATEST FIRST ----------------
  pipeline.push({ $sort: { createdAt: -1 } });

  // ---------------- FINAL PROJECTION ----------------
  pipeline.push({
    $project: {
      _id: 0,

      eventId: "$event._id",
      eventName: "$event.title",

      userEmail: "$user.userEmail",
      userName: "$user.userName",

      ticketStatus: "$status",
      numberOfTickets: "$quantity",

      date: "$createdAt",
      amount: "$payment.amount",

      paymentId: "$payment.razorpayPaymentId",
      receiptId: "$receiptId",
    },
  });

  return Tickets.aggregate(pipeline);
};
