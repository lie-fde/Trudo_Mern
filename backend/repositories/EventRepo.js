import Events from "../models/Events.js";

export const createEventRepo = async(eventData) => await Events.create(eventData)

export const getAllEventsRepo = () => Events.find().sort({ createdAt: -1 });


export const findEventByIdRepo = async (eventId) => {
  return await Events.findById(eventId)
    .populate("User", "userName userEmail mobileNumber")
    .lean();
};



export const findPendingEventsRepo = async () => {
  return await Events.find({ status: "Pending", isDeleted: false }).populate(
    "User",
    "userName userEmail mobileNumber"
  );
};

export const updateEventStatusRepo = async (eventId, updateData) => {
  return await Events.findByIdAndUpdate(eventId, updateData, { new: true });
};

export const findAll = async(filter, options)=>{
  const { page, limit, sort } = options;

  return Events.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
}

export const count= async(filter)=> {
  return Events.countDocuments(filter);
}



export const blockEventRepository = async (id) => {
  return await Events.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
};

export const unblockEventRepository = async (id) => {
  return await Events.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
};

export const deleteEventRepository = async (id) => {
  return await Events.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};



export const getEventsUserRepo = async ({
  page,
  limit,
  search,
  sort,
  userCity,
  userName
}) => {
  const skip = (page - 1) * limit;
  const cityInput = userCity ? userCity.trim().toLowerCase() : null;

  const matchStage = {
    isDeleted: false,
    isBlocked: false,
    status: "Approved",
  };

  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { venue: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [{ $match: matchStage }];

  // 🔥 Apply nearby logic ONLY if sort === nearby
  if (sort === "nearby" && cityInput) {
    pipeline.push(
      {
        $addFields: {
          isNearby: {
            $cond: [
              { $eq: [{ $toLower: "$venue" }, cityInput] },
              1,
              0,
            ],
          },
        },
      },
      {
        $sort: {
          isNearby: -1,
          createdAt: -1,
        },
      }
    );
  } else {
    // 🔥 Normal sorting
    pipeline.push({
      $sort: {
        createdAt: sort === "oldest" ? 1 : -1,
      },
    });
  }

  pipeline.push({
    $addFields: {
      createdBy: { $literal: userName },
    },
  });


  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await Events.aggregate(pipeline);

  return {
    events: result[0]?.data || [],
    total: result[0]?.totalCount[0]?.count || 0,
  };
};
