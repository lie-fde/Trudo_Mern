import React from "react";

export default function StepPersonalInfo({ register, errors, adminName, adminEmail, nextStep }) {
  return (
    <div className="space-y-6">

      <div>
        <label className="text-sm">Full Name *</label>
        <input
          {...register("fullName", { required: "Full Name is required" })}
          defaultValue={adminName}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="text-sm">Email *</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          defaultValue={adminEmail}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={nextStep} className="px-6 py-2 bg-purple-600 text-white rounded-lg">
          Next
        </button>
      </div>
    </div>
  );
}
