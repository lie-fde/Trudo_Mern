import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DropZone from "../reusable/dropfile";

export default function EventFormAdmin({
  register,
  errors,
  setValue,
  watch,
  editing,
  eventData,
}) {
  const { adminName, adminEmail } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (!editing || !eventData) return;

    const fields = [
      "fullName",
      "email",
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

    fields.forEach((field) => {
      if (eventData[field]) {
        if (field === "date") {
          setValue(
            "date",
            eventData.date.$date
              ? eventData.date.$date.split("T")[0]
              : eventData.date.split("T")[0]
          );
        } else {
          setValue(field, eventData[field]);
        }
      }
    });

    // Note: Image preview population logic has been removed.
  }, [editing, eventData, setValue]);

  return (
    <div className="space-y-6">
      {/* --- PERSONAL INFO --- */}
      <div>
        <label className="text-sm">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName", { required: "Required" })}
          value={adminName || ""}
          className="w-full mt-1 p-3 border rounded-md bg-gray-100"
          readOnly
        />
      </div>

      <div>
        <label className="text-sm">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email", { required: "Required" })}
          value={adminEmail || ""}
          className="w-full mt-1 p-3 border rounded-md bg-gray-100"
          readOnly
        />
      </div>

      {/* --- EVENT DETAILS --- */}
      <div>
        <label className="text-sm">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Event title is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          {...register("description", { required: "Description is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          >
            <option value="">Select Category</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Technology">Technology</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            {...register("venue", { required: "Venue is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
          {errors.venue && (
            <p className="text-red-500 text-xs">{errors.venue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
          {errors.date && (
            <p className="text-red-500 text-xs">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm">
            Event Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...register("eventTime", { required: "Time is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm">
            Duration (hrs) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("duration", { required: "Duration is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">
            Ticket Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("ticketPrice", { required: "Price is required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm">
            Total Tickets <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("totalTickets", { required: "Tickets required" })}
            className="w-full mt-1 p-3 border rounded-md"
          />
        </div>
      </div>

      {/* --- IMAGE SECTION (No Preview) --- */}
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm font-semibold mb-3">
          Event Image
          {/* Show asterisk only if NOT editing */}
          {!editing && <span className="text-red-500"> *</span>}
        </p>

        {/* Upload Component */}
        <DropZone
          label={editing ? "Change Image (Optional)" : "Upload Image"}
          name="eventImages"
          accept="image/*"
          register={register("eventImages", {
            validate: (value) => {
              if (editing) return true; // optional in edit

              if (value instanceof File) return true;

              return "Event image is required";
            },
          })}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />

      </div>

      {/* Hidden input to pass removed images to backend */}
      <input type="hidden" {...register("removedImages")} />

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {editing ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
}
