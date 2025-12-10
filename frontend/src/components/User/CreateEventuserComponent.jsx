import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DropZone from "../reusable/dropfile";

export default function EventForm({
  register,
  errors,
  setValue,
  watch,
  editing = false,
  eventData = {},
}) {
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const { userName, userEmail } = useSelector((state) => state.auth);

  // Prefill fields when editing
  useEffect(() => {
    if (editing && eventData) {
      const fields = [
        "fullName",
        "email",
        "title",
        "description",
        "venue",
        "eventTime",
        "duration",
        "ticketPrice",
        "totalTickets",
        "date",
      ];

      fields.forEach((fld) => {
        if (eventData[fld]) setValue(fld, eventData[fld]);
      });

      if (eventData.images && Array.isArray(eventData.images)) {
        setExistingImages(eventData.images);
      }
    }
  }, [editing, eventData, setValue]);

  // Remove existing image
  const removeExistingImage = (img) => {
    setRemovedImages([...removedImages, img]);
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleFile = (name, file) => {
    setValue(name, file, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* PERSONAL INFO */}
      <div>
        <label className="text-sm">Full Name *</label>
        <input
          {...register("fullName", {
            required: "Full Name is required",
            validate: (v) => v.trim() !== "" || "Full Name cannot be empty",
          })}
          value={userName}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Email *</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            validate: (v) => v.trim() !== "" || "Email cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
          value={userEmail}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* EVENT DETAILS */}

      <div>
        <label className="text-sm">Event Title *</label>
        <input
          {...register("title", {
            required: "Event title is required",
            validate: (v) => v.trim() !== "" || "Event Title cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Description *</label>
        <textarea
          {...register("description", {
            required: "Description is required",
            validate: (v) => v.trim() !== "" || "Description cannot be empty",
          })}
          rows={5}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Venue *</label>
        <input
          {...register("venue", {
            required: "Venue is required",
            validate: (v) => v.trim() !== "" || "Venue cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.venue && (
          <p className="text-red-500 text-xs">{errors.venue.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Event Time *</label>
        <input
          type="time"
          {...register("eventTime", { required: "Event time is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.eventTime && (
          <p className="text-red-500 text-xs">{errors.eventTime.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Event Date *</label>
        <input
          type="date"
          {...register("date", { required: "Event date is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.date && (
          <p className="text-red-500 text-xs">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Duration (in hours) *</label>
        <input
          type="number"
          {...register("duration", { required: "Duration is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.duration && (
          <p className="text-red-500 text-xs">{errors.duration.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Ticket Price (₹) *</label>
        <input
          type="number"
          {...register("ticketPrice", { required: "Ticket Price is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.ticketPrice && (
          <p className="text-red-500 text-xs">{errors.ticketPrice.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Total Tickets *</label>
        <input
          type="number"
          {...register("totalTickets", { required: "Total tickets required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.totalTickets && (
          <p className="text-red-500 text-xs">{errors.totalTickets.message}</p>
        )}
      </div>

      {/* EXISTING IMAGES */}
      {editing && existingImages.length > 0 && (
        <div>
          <p className="text-sm mb-2 font-semibold">Existing Images</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img} className="relative">
                <img
                  src={img}
                  className="h-24 w-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW IMAGE UPLOAD */}
      <DropZone
        label="Event Images"
        name="eventImages"
        accept="image/*"
        register={register("eventImages", {
          validate: () => {
            const hasExisting = existingImages.length > 0;
            const newFile = watch("eventImages");

            if (!editing && !newFile) return "Event images are required";

            if (editing && !hasExisting && !newFile)
              return "Please upload at least one image";

            return true;
          },
        })}
        errors={errors}
        watch={watch}
        setValue={setValue}
        handleFile={handleFile}
      />

   

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          {editing ? "Update Event" : "Create Event"}
        </button>
      </div>

      {/* Removed images (for backend) */}
      <input
        type="hidden"
        {...register("removedImages")}
        value={removedImages}
      />
    </div>
  );
}
