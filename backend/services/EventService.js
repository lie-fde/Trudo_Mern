import {
  createEventRepo,
  findPendingEventsRepo,
  updateEventStatusRepo,
  findEventByIdRepo,
  findAll,
  count,
  blockEventRepository,
  unblockEventRepository,
  deleteEventRepository,
  getEventsUserRepo,
  updateEventRepo,
} from "../repositories/EventRepo.js";
import User from "../repositories/UserRepository.js";

export const createEventService = async (id, body, file) => {
  if (!file) {
    throw new Error("Event image is required");
  }

  // 1. Create Date objects
  console.log(body.date);
  const inputDate = new Date(body.date);
  const today = new Date();

  // 2. Reset time to midnight (00:00:00) for both to compare ONLY the date
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 3. Check if input date is Today or Earlier
  if (inputDate.getTime() <= today.getTime()) {
    throw {
      statusCode: 400,
      message:
        "Events must be scheduled for a future date (cannot be today or in the past)",
    };
  }

  // Multer-Cloudinary: file.path already contains Cloudinary URL
  const cloudinaryImageUrl = file.path;

  const eventData = {
    User: id,
    title: body.title,
    description: body.description,
    category: body.category,
    venue: body.venue,
    eventTime: body.eventTime,
    duration: body.duration,
    ticketPrice: body.ticketPrice,
    totalTickets: body.totalTickets,
    date: body.date,
    images: [cloudinaryImageUrl],
  };

  return await createEventRepo(eventData);
};

export const updateEventService = async (eventId, req) => {
  const event = await findEventByIdRepo(eventId);
  if (!event) throw new Error("Event not found");

  const inputDate = new Date(req.body.date);
  const today = new Date();

  // 2. Reset time to midnight (00:00:00) for both to compare ONLY the date
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 3. Check if input date is Today or Earlier
  if (inputDate.getTime() < today.getTime()) {
    throw {
      statusCode: 400,
      message:
        "Events must be scheduled for a future date (cannot be today or in the past)",
    };
  }

  const updateData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    venue: req.body.venue,
    eventTime: req.body.eventTime,
    duration: req.body.duration,
    ticketPrice: req.body.ticketPrice,
    totalTickets: req.body.totalTickets,
    date: req.body.date,
  };

  // 🔥 Only update images if new image uploaded
  if (req.file) {
    updateData.images = [req.file.path];
  }

  return await updateEventRepo(eventId, updateData);
};

export const getPendingEventsService = async () => {
  return await findPendingEventsRepo();
};

export const updateEventStatusService = async (
  eventId,
  status,
  rejectionReason
) => {
  const updateData = {
    status,
    rejectionReason: rejectionReason || null,
  };

  const updated = await updateEventStatusRepo(eventId, updateData);
  return updated;
};

export const getSingleEventService = async (eventId) => {
  const event = await findEventByIdRepo(eventId);

  if (!event) {
    return {
      success: false,
      statusCode: 404,
      message: "Event not found",
    };
  }

  return {
    success: true,
    statusCode: 200,
    data: event,
  };
};

export const getAllEventsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  let filter = { isDeleted: false, status: "Approved" }; // default filter
  let sort = { createdAt: -1 }; // default sort (latest)

  // ---- SEARCH ----
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  // ---- CATEGORY FILTER ----
  if (query.category && query.category !== "") {
    filter.category = query.category;
  }

  // ---- SORTING ----
  if (query.sort === "priceDesc") sort = { ticketPrice: -1 };
  if (query.sort === "priceAsc") sort = { ticketPrice: 1 };
  if (query.sort === "latest") sort = { createdAt: -1 };

  // ---- FETCH EVENTS ----
  const events = await findAll(filter, { page, limit, sort });
  const total = await count(filter);

  return {
    events,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const blockEventService = async (eventId) => {
  const event = await findEventByIdRepo(eventId);

  if (!event) throw new Error("Event not found");
  if (event.isBlocked) throw new Error("Event already blocked");

  return await blockEventRepository(eventId);
};

export const unblockEventService = async (eventId) => {
  const event = await findEventByIdRepo(eventId);

  if (!event) throw new Error("Event not found");
  if (!event.isBlocked) throw new Error("Event already unblocked");

  return await unblockEventRepository(eventId);
};

export const deleteEventService = async (eventId) => {
  const event = await findEventByIdRepo(eventId);

  if (!event) throw new Error("Event not found");
  if (event.isDeleted) throw new Error("Event already deleted");

  return await deleteEventRepository(eventId);
};

export const getEventsUserService = async (query, id) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 8;
  const search = query.search || "";
  const sort = query.sort || "newest"; // newest | oldest

  const user = await User.findById(id, "address.city");
  const userCity = user?.address?.city || null;
  const userName = user.userName;

  return await getEventsUserRepo({
    page,
    limit,
    search,
    sort,
    userCity,
    userName,
  });
};
