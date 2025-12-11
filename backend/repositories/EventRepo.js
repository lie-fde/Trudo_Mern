import Events from "../models/Events.js";

export const createEventRepo = async(eventData) => await Events.create(eventData)

export const getAllEventsRepo = () => Events.find().sort({ createdAt: -1 });

// export const getEventByIdRepo = (id) => Events.findById(id);

// export const updateEventStatusRepo = (id, status) =>
//   Events.findByIdAndUpdate(id, { status }, { new: true });

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