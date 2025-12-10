import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi.js";

import StepPersonalInfo from "../../components/Admin/StepPersonalInfo.jsx";
import StepEventDetails from "../../components/Admin/StepEventDetails.jsx";

export default function CreateEvent() {
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const adminName = useSelector((state) => state.adminAuth.adminName);
  const adminEmail = useSelector((state) => state.adminAuth.adminEmail);

  const nextStep = async () => {
    const required = ["fullName", "email"];
    const ok = await trigger(required);
    if (ok) setStep(2);
  };

  const backStep = () => setStep(1);

  const submitEvent = async (data) => {
    const required = [
      "title",
      "description",
      "venue",
      "eventTime",
      "duration",
      "ticketPrice",
      "totalTickets",
      "eventImages",
      "date",
    ];

    const ok = await trigger(required);
    if (!ok) return setStep(2);

    const confirmed = await Swal.fire({
      title: "Create Event?",
      text: "Do you want to publish this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if (!confirmed.isConfirmed) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("venue", data.venue);
    formData.append("eventTime", data.eventTime);
    formData.append("duration", data.duration);
    formData.append("ticketPrice", data.ticketPrice);
    formData.append("totalTickets", data.totalTickets);
    formData.append("date", data.date);

    if (data.eventImages) formData.append("eventImages", data.eventImages);

    try {
      await adminApi.post("/admin/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Event created successfully!", "success");
      navigate("/admin/events");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* LOADING OVERLAY */}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-pink-500 rounded-full mx-auto"></div>
            <p className="mt-3">Creating Event...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow">
          <h1 className="text-4xl font-extrabold text-center mb-6">Create Event</h1>

          <form onSubmit={handleSubmit(submitEvent)} noValidate>
            {step === 1 && (
              <StepPersonalInfo
                register={register}
                errors={errors}
                adminName={adminName}
                adminEmail={adminEmail}
                nextStep={nextStep}
              />
            )}

            {step === 2 && (
              <StepEventDetails
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                backStep={backStep}
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}
