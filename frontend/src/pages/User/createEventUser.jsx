import React from "react";
import { useForm } from "react-hook-form";
import EventForm from "../../components/User/CreateEventuserComponent.jsx";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/authService.js";

export default function CreateEventPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitEvent = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("venue", data.venue);
    formData.append("eventTime", data.eventTime);
    formData.append("duration", data.duration);
    formData.append("ticketPrice", data.ticketPrice);
    formData.append("totalTickets", data.totalTickets);
    formData.append("date", data.date);

    const confirmed = await Swal.fire({
      title: "Create Event?",
      text: "Do you want to publish this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if (!confirmed.isConfirmed) return;

    setSubmitting(true);

    if (data.eventImages) formData.append("eventImages", data.eventImages);

    try {
      await createEvent(formData);

      Swal.fire("Success", "Event created successfully!", "success");
      navigate("/");
    } catch (err) {
      console.log("EVENT ERROR:", err.response?.data);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">
              Creating campaign...
            </p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
        <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-md">
          {/* PAGE TITLE */}
          <h1 className="text-4xl font-extrabold text-center mb-10">
            Create Event
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit(submitEvent)} className="space-y-6">
            <EventForm
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </form>
        </div>
      </div>
    </>
  );
}
