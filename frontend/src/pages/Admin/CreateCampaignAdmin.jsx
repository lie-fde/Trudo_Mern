import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DropZone from "../../components/reusable/dropfile.jsx";
import Swal from 'sweetalert2'
import { useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import adminApi from "../../api/adminApi.js";


export default function CreateCampaignAdmin() {
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const navigate = useNavigate()
  
  const userName = useSelector((state)=> state.adminAuth.adminName)
  const userEmail = useSelector((state)=> state.adminAuth.adminEmail)
  const [step, setStep] = useState(1);
  const orgType = watch("orgType");

  const handleFile = (name, file) => {
    setValue(name, file || null, { shouldValidate: true, shouldTouch: true });
  };

  const [submitting, setSubmitting] = useState(false);

  const nextStep = async () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "orgType",
      "bankAcc",
      "ifsc",
    ];

    if (orgType === "Organization") {
      requiredFields.push("orgName", "orgProof");
    }

    const ok = await trigger(requiredFields);
    if (ok) setStep(2);
  };

  const backStep = () => setStep(1);

 const onFinalSubmit = async (data) => {
  const step2Fields = [
    "title",
    "beneficiary",
    "category",
    "detail",
    "location",
    "amount",
    "campaignImage",
    "campaignDocs",
  ];

  let validateFields = [
    "orgType",
    "bankAcc",
    "ifsc",
    ...step2Fields,
  ];

  if (orgType === "Organization") {
    validateFields.push("orgName", "orgProof");
  }

  const ok = await trigger(validateFields);
  if (!ok) {
    setStep(1);
    return;
  }

  const result = await Swal.fire({
    title: "Confirm Submission",
    text: "Once submitted, this campaign cannot be edited. Continue?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Submit",
    cancelButtonText: "Cancel",
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

  formData.append("campaignImage", data.campaignImage);
  formData.append("campaignDocs", data.campaignDocs);

  formData.append("targetAmount", data.amount);
formData.append("beneficiaryName", data.beneficiary);

  formData.append("bankAcc", data.bankAcc);
  formData.append("IFSCCode", data.ifsc);


  try {
     await adminApi.post("/admin/campaigns/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials:true,
    });

    setSubmitting(false);

    Swal.fire({
      title: "Success!",
      text: "Campaign has been created successfully.",
      icon: "success",
    });

    navigate("/admin/dashboard")

  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: err.response?.data?.message || "Something went wrong.",
      icon: "error",
    });
  }
};
  return (
    <>
    {submitting && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-700 font-medium">Creating campaign...</p>
    </div>
  </div>
     )}
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-4xl font-extrabold text-center mb-8">Create Campaign</h1>

        <form noValidate onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">

          {step === 1 && (
            <>
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("fullName", { required: "Full Name is required" })}
                  placeholder="Enter full name" value={userName}
                  className={`w-full mt-1 p-3 border rounded-md ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>

        
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                  })}
                  placeholder="name@example.com" value={userEmail}
                  className={`w-full mt-1 p-3 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

       
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9+\-() ]{6,20}$/, message: "Enter a valid phone" },
                  })}
                  placeholder="+91 9876543210"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

         
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Organization / Individual <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("orgType", { required: "Please select Organization or Individual" })}
                  className={`w-full mt-1 p-3 border rounded-md ${errors.orgType ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select option</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                </select>
                {errors.orgType && <p className="text-xs text-red-500 mt-1">{errors.orgType.message}</p>}
              </div>

             
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Organization Name {orgType === "Organization" && <span className="text-red-500">*</span>}
                </label>
                <input
                  {...register("orgName", {
                    required: orgType === "Organization" ? "Organization Name is required" : false,
                  })}
                  placeholder="Organization name (if applicable)"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.orgName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.orgName && <p className="text-xs text-red-500 mt-1">{errors.orgName.message}</p>}
              </div>

       
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("bankAcc", { required: "Bank account number is required" })}
                  placeholder="Enter bank account number"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.bankAcc ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.bankAcc && <p className="text-xs text-red-500 mt-1">{errors.bankAcc.message}</p>}
              </div>

             
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("ifsc", { required: "IFSC is required" })}
                  placeholder="Enter IFSC code"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.ifsc ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.ifsc && <p className="text-xs text-red-500 mt-1">{errors.ifsc.message}</p>}
              </div>

        
              <DropZone
                label={orgType === "Organization" ? "Organization Proof" : "Organization Proof (optional)"}
                name="orgProof"
                accept="image/*,.pdf"
                required={orgType === "Organization"}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                handleFile={handleFile}
              />
             
              <input
                type="hidden"
                {...register("orgProof", {
                  required: orgType === "Organization" ? "Organization proof is required" : false,
                })}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Next
                </button>
              </div>
            </>
          )}

      
          {step === 2 && (
            <>
           
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Campaign title is required" })}
                  placeholder="Campaign title"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
              </div>

            
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Beneficiary Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("beneficiary", { required: "Beneficiary is required" })}
                  placeholder="Beneficiary name"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.beneficiary ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.beneficiary && <p className="text-xs text-red-500 mt-1">{errors.beneficiary.message}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className={`w-full mt-1 p-3 border rounded-md ${errors.category ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Category</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

        
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("detail", { required: "Detailed explanation is required" })}
                  rows={5}
                  placeholder="Describe the campaign in detail"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.detail ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.detail && <p className="text-xs text-red-500 mt-1">{errors.detail.message}</p>}
              </div>

       
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("location", { required: "Location is required" })}
                  placeholder="City, State, Country"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.location ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
              </div>

  
              <div>
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  Target Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("amount", { required: "Target amount is required", valueAsNumber: true })}
                  placeholder="Enter amount"
                  className={`w-full mt-1 p-3 border rounded-md ${errors.amount ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
              </div>

      
              <DropZone
                label="Campaign Image"
                name="campaignImage"
                accept="image/*"
                required={true}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                handleFile={handleFile}
              />
              <input
                type="hidden"
                {...register("campaignImage", { required: "Campaign image is required" })}
              />

     
              <DropZone
                label="Campaign Proof / Documents"
                name="campaignDocs"
                accept="image/*,.pdf"
                required={true}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                handleFile={handleFile}
              />
              <input
                type="hidden"
                {...register("campaignDocs", { required: "Campaign documents are required" })}
              />

              <div className="flex justify-between">
                <button type="button" onClick={backStep} className="px-6 py-2 border rounded-lg">
                  Back
                </button>

                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">
                  Create Campaign
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

