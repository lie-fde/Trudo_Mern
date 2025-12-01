import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DropZone from "../../components/reusable/dropfile.jsx";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../../api/adminApi.js";

export default function EditCampaignAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ mode: "onTouched" });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const orgType = watch("orgType");

  // ------------------------------
  //  FETCH EXISTING CAMPAIGN DATA
  // ------------------------------
  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await adminApi.get(`/admin/campaigns/${id}`);
        const c = res.data.campaign;

        // step 1
        setValue("fullName", c.User?.userName || "");
        setValue("email", c.User?.userEmail || "");
        setValue("phone", c.User?.mobileNumber || "");
        setValue("orgType", c.organizationName ? "Organization" : "Individual");
        setValue("orgName", c.organizationName || "");
        setValue("bankAcc", c.bankDetails?.accountNumber || "");
        setValue("ifsc", c.bankDetails?.IFSCCode || "");

        // step 2
        setValue("title", c.title);
        setValue("beneficiary", c.beneficiary);
        setValue("category", c.category);
        setValue("detail", c.description);
        setValue("location", c.location);
        setValue("amount", c.targetAmount);

        setLoading(false);
      } catch (err) {
        Swal.fire("Error", "Failed to load campaign", "error");
      }
    }

    loadCampaign();
  }, [id, setValue]);

  const handleFile = (name, file) => {
    setValue(name, file || null, { shouldValidate: true, shouldTouch: true });
  };

  // ------------------------------
  //  SUBMIT UPDATED DATA
  // ------------------------------
  const onFinalSubmit = async (data) => {
    const ok = await trigger();
    if (!ok) {
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to update this campaign?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update"
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);

    const formData = new FormData();

    formData.append("organizationName", data.orgType === "Organization" ? data.orgName : "");
    if (data.orgProof) formData.append("orgProof", data.orgProof);

    formData.append("title", data.title);
    formData.append("description", data.detail);
    formData.append("category", data.category);
    formData.append("location", data.location);
    formData.append("targetAmount", data.amount);
    formData.append("beneficiaryName", data.beneficiary);

    formData.append("bankAcc", data.bankAcc);
    formData.append("IFSCCode", data.ifsc);

    // optional updates
    if (data.campaignImage) formData.append("campaignImage", data.campaignImage);
    if (data.campaignDocs) formData.append("campaignDocs", data.campaignDocs);

    try {
      await adminApi.patch(`/admin/campaign/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      Swal.fire("Success", "Campaign updated successfully", "success");
      navigate(`/admin/campaigns-request/${id}`);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading campaign...
      </div>
    );
  }

  return (
    <>
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Updating campaign...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow">
          <h1 className="text-4xl font-extrabold text-center mb-8">Edit Campaign</h1>

          {/* EXACT SAME UI as create */}
          <form noValidate onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">

            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
              <>
                {/* Full name */}
                <div>
                  <label className="text-sm text-gray-700">Full Name</label>
                  <input
                    {...register("fullName")}
                    className="w-full mt-1 p-3 border rounded-md"
                    readOnly
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    {...register("email")}
                    className="w-full mt-1 p-3 border rounded-md"
                    readOnly
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-700">Phone</label>
                  <input
                    {...register("phone")}
                    className="w-full mt-1 p-3 border rounded-md"
                    readOnly
                  />
                </div>

                {/* Org type */}
                <div>
                  <label className="text-sm text-gray-700">Organization / Individual</label>
                  <select {...register("orgType")} className="w-full mt-1 p-3 border rounded-md">
                    <option value="Organization">Organization</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                {/* Org name */}
                <div>
                  <label className="text-sm text-gray-700">Organization Name</label>
                  <input {...register("orgName")} className="w-full mt-1 p-3 border rounded-md" />
                </div>

                {/* Bank */}
                <div>
                  <label className="text-sm text-gray-700">Bank Account Number</label>
                  <input {...register("bankAcc")} className="w-full mt-1 p-3 border rounded-md" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">IFSC Code</label>
                  <input {...register("ifsc")} className="w-full mt-1 p-3 border rounded-md" />
                </div>

                {/* Proof - OPTIONAL */}
                <DropZone
                  label="Organization Proof (optional)"
                  name="orgProof"
                  accept="image/*,.pdf"
                  required={false}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  handleFile={handleFile}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
              <>
                {/* Title */}
                <div>
                  <label className="text-sm text-gray-700">Campaign Title</label>
                  <input {...register("title")} className="w-full mt-1 p-3 border rounded-md" />
                </div>

                {/* Beneficiary */}
                <div>
                  <label className="text-sm text-gray-700">Beneficiary</label>
                  <input
                    {...register("beneficiary")}
                    className="w-full mt-1 p-3 border rounded-md"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm text-gray-700">Category</label>
                  <select {...register("category")} className="w-full mt-1 p-3 border rounded-md">
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-700">Detailed Explanation</label>
                  <textarea
                    {...register("detail")}
                    rows={5}
                    className="w-full mt-1 p-3 border rounded-md"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm text-gray-700">Location</label>
                  <input
                    {...register("location")}
                    className="w-full mt-1 p-3 border rounded-md"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm text-gray-700">Target Amount (₹)</label>
                  <input
                    type="number"
                    {...register("amount")}
                    className="w-full mt-1 p-3 border rounded-md"
                  />
                </div>

                {/* Campaign image - OPTIONAL */}
                <DropZone
                  label="Update Campaign Image (optional)"
                  name="campaignImage"
                  accept="image/*"
                  required={false}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  handleFile={handleFile}
                  errors={errors}
                />

                {/* Documents - OPTIONAL */}
                <DropZone
                  label="Update Campaign Documents (optional)"
                  name="campaignDocs"
                  accept="image/*,.pdf"
                  required={false}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  handleFile={handleFile}
                  errors={errors}
                />

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border rounded-lg"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Update Campaign
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
