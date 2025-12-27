import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import EventFormAdmin from "../../components/Admin/CreateEventAdminComponent";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await adminApi.get(`/events/${id}`);
        const event = res.data.event;

        setEventData(event);

        setValue("title", event.title);
        setValue("description", event.description);
        setValue("category", event.category);
        setValue("venue", event.venue);
        setValue("eventTime", event.eventTime);
        setValue("duration", event.duration);
        setValue("ticketPrice", event.ticketPrice);
        setValue("totalTickets", event.totalTickets);
        setValue("date", event.date.split("T")[0]);
      } catch (err) {
        Swal.fire("Error", "Failed to load event", "error");
        navigate("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, setValue]);

  const submitUpdate = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== "eventImages") {
        formData.append(key, value);
      }
    });

      if (data.eventImages instanceof File) {
    formData.append("eventImages", data.eventImages);
  }
    const confirm = await Swal.fire({
      title: "Update Event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
    });

    if (!confirm.isConfirmed) return;

    setSubmitting(true);

    try {
      await adminApi.put(`/admin/events/edit/${id}`, formData);
      Swal.fire("Success", "Event updated", "success");
      navigate("/admin/events");
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-10 rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Event</h1>

        <form onSubmit={handleSubmit(submitUpdate)}>
          <EventFormAdmin
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            editing={true}
            eventData={eventData}
          />
        </form>
      </div>
    </div>
  );
}
