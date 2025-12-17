import React, { useEffect, useState } from "react";
import DropZone from "../reusable/dropfile";

export default function EditEventForm({
  register,
  errors,
  setValue,
  watch,
  eventData = {},
}) {
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImagePreview, setNewImagePreview] = useState(null);

  useEffect(() => {
    if (eventData) {
      const fields = [
        "title",
        "description",
        "category",
        "venue",
        "eventTime",
        "duration",
        "ticketPrice",
        "totalTickets",
        "date",
      ];

      fields.forEach((fld) => {
        if (eventData[fld]) {
          if (fld === "date") {
            setValue("date", eventData.date?.split("T")[0]);
          } else {
            setValue(fld, eventData[fld]);
          }
        }
      });

      if (Array.isArray(eventData.images)) {
        setExistingImages(eventData.images);
      }
    }
  }, [eventData, setValue]);

  const removeExistingImage = (img) => {
    setRemovedImages([...removedImages, img]);
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleFile = (name, file) => {
    setValue(name, file, { shouldValidate: true });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNewImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setNewImagePreview(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ----------------- TITLE ----------------- */}
      <div>
        <label className="text-sm">Event Title *</label>
        <input
          {...register("title", { required: "Event title is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* ----------------- DESCRIPTION ----------------- */}
      <div>
        <label className="text-sm">Description *</label>
        <textarea
          rows={5}
          {...register("description", { required: "Description is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Category *</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        >
          <option value="">Select</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* ----------------- VENUE ----------------- */}
      <div>
        <label className="text-sm">Venue *</label>
        <input
          {...register("venue", { required: "Venue is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.venue && (
          <p className="text-red-500 text-xs">{errors.venue.message}</p>
        )}
      </div>

      {/* ----------------- TIME ----------------- */}
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

      {/* ----------------- DATE ----------------- */}
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

      {/* ----------------- DURATION ----------------- */}
      <div>
        <label className="text-sm">Duration (hours) *</label>
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
          {...register("ticketPrice", { required: "Ticket price is required" })}
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
          {...register("totalTickets", {
            required: "Total tickets are required",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.totalTickets && (
          <p className="text-red-500 text-xs">{errors.totalTickets.message}</p>
        )}
      </div>

      {existingImages.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">Existing Images</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="h-24 w-24 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- NEW IMAGE UPLOAD ----------------- */}
      <DropZone
        label="Upload New Image"
        name="eventImages"
        accept="image/*"
        register={register("eventImages")}
        errors={errors}
        watch={watch}
        setValue={setValue}
        handleFile={handleFile}
      />

      {/* ----------------- NEW IMAGE PREVIEW ----------------- */}
      {newImagePreview && (
        <div>
          <p className="text-sm font-semibold">New Image Preview:</p>
          <img
            src={newImagePreview}
            className="h-32 w-32 object-cover rounded border"
          />
        </div>
      )}

      {/* Hidden removed images */}
      <input
        type="hidden"
        {...register("removedImages")}
        value={removedImages}
      />

      {/* ----------------- UPDATE BUTTON ----------------- */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Update Event
        </button>
      </div>
    </div>
  );
}
