import { createEventRepo } from "../repositories/EventRepo.js";

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