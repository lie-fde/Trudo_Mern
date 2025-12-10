import React from "react";
import DropZone from "../reusable/dropfile.jsx";

export default function StepEventDetails({ register, errors, watch, setValue, backStep }) {
  const handleFile = (name, file) => setValue(name, file, { shouldValidate: true });

  return (
    <div className="space-y-6">

      <div>
        <label className="text-sm">Event Title *</label>
        <input
          {...register("title", { required: "Event title is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-sm">Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={5}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div>
        <label className="text-sm">Venue *</label>
        <input
          {...register("venue", { required: "Venue is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
      </div>

      <div>
        <label className="text-sm">Event Time *</label>
        <input
          type="time"
          {...register("eventTime", { required: "Event time is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
      </div>

      <div>
        <label className="text-sm">Event Date *</label>
        <input
          type="date"
          {...register("date", { required: "Event date is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
      </div>

      <div>
        <label className="text-sm">Duration (in hours) *</label>
        <input
          type="number"
          {...register("duration", { required: "Duration is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
      </div>

      <div>
        <label className="text-sm">Ticket Price (₹) *</label>
        <input
          type="number"
          {...register("ticketPrice", { required: "Ticket Price is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
      </div>

      <div>
        <label className="text-sm">Total Tickets *</label>
        <input
          type="number"
          {...register("totalTickets", { required: "Total tickets required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
      </div>

      <DropZone
        label="Event Images"
        name="eventImages"
        accept="image/*"
        required={true}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        handleFile={handleFile}
      />

      <div className="flex justify-between mt-6">
        <button type="button" onClick={backStep} className="px-6 py-2 border rounded-lg">
          Back
        </button>

        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">
          Create Event
        </button>
      </div>
    </div>
  );
}
