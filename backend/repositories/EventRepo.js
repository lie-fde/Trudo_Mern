import Events from "../models/Events.js";

export const createEventRepo = async(eventData) => await Events.create(eventData)

export const getAllEventsRepo = () => Events.find().sort({ createdAt: -1 });

export const getEventByIdRepo = (id) => Events.findById(id);

export const updateEventStatusRepo = (id, status) =>
  Events.findByIdAndUpdate(id, { status }, { new: true });