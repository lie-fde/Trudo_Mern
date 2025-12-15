import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import EventFormAdmin from "../../components/Admin/CreateEventAdminComponent";

export default function EditEventPage() {
  const { id } = useParams(); // event id from URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ------------------------------------------------------------
  // FETCH EVENT DETAILS & PREFILL THE FORM
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await adminApi.get(`/events/${id}`);
        const event = res.data.event;

        // PREFILL FORM DATA
        setValue("title", event.title);
        setValue("description", event.description);
        setValue("category", event.category);
        setValue("venue", event.venue);
        setValue("eventTime", event.eventTime);
        setValue("duration", event.duration);
        setValue("ticketPrice", event.ticketPrice);
        setValue("totalTickets", event.totalTickets);
        setValue("date", event.date?.split("T")[0]); // convert ISO ➝ yyyy-mm-dd
      } catch (err) {
        console.log(err);
        Swal.fire("Error", "Failed to load event details", "error");
        navigate("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, setValue]);

  // ------------------------------------------------------------
  // SUBMIT UPDATED EVENT
  // ------------------------------------------------------------
  const submitUpdate = async (data) => {
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

    // Only include image if user selected a new one
    if (data.eventImages) {
      formData.append("eventImages", data.eventImages);
    }

    const confirmed = await Swal.fire({
      title: "Update Event?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });

    if (!confirmed.isConfirmed) return;

    setSubmitting(true);

    try {
      await adminApi.put(`/events/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Event updated successfully!", "success");
      navigate("/admin/events");
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // LOADING UI
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading event...
      </div>
    );
  }

  return (
    <>
      {/* SUBMITTING POPUP */}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">
              Updating event...
            </p>
          </div>
        </div>
      )}

      {/* MAIN WRAPPER */}
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
        <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-md">
          {/* PAGE TITLE */}
          <h1 className="text-4xl font-extrabold text-center mb-10">
            Edit Event
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit(submitUpdate)} className="space-y-6">
            <EventFormAdmin
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              isEditMode={true}   // optional prop if needed
            />
          </form>
        </div>
      </div>
    </>
  );
}
