import { createEventRepo , findPendingEventsRepo , updateEventStatusRepo ,findEventByIdRepo} from "../repositories/EventRepo.js";

export const createEventService = async (id, body, file) => {

  if (!file) {
    throw new Error("Event image is required");
  }

  // Multer-Cloudinary: file.path already contains Cloudinary URL
  const cloudinaryImageUrl = file.path;



  const eventData = {
    User: id,
    title: body.title,
    description: body.description,
    category : body.category,
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


export const getPendingEventsService = async () => {
  return await findPendingEventsRepo();
};

export const updateEventStatusService = async (eventId, status, rejectionReason) => {
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