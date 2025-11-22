// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import DropZone from "../components/reusable/dropfile.jsx";

// export default function CreateCampaign() {
//   const {
//     register,
//     handleSubmit,
//     trigger,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     mode: "onTouched",
//   });

//   const [step, setStep] = useState(1);

//   // Watch orgType for conditional required fields
//   const orgType = watch("orgType");

//   // Handle file selection
//   const handleFile = (name, file) => {
//     setValue(name, file, { shouldValidate: true, shouldTouch: true });
//   };

//   // Step 1 -> Step 2 validation
//   const nextStep = async () => {
//     const requiredFields = [
//       "fullName",
//       "email",
//       "phone",
//       "orgType",
//       "bankAcc",
//       "ifsc",
//     ];

//     if (orgType === "Organization") {
//       requiredFields.push("orgName", "orgProof");
//     }

//     const valid = await trigger(requiredFields);
//     if (valid) setStep(2);
//   };

//   const backStep = () => setStep(1);

//   // Final submit (validates entire form)
//   const onFinalSubmit = async (data) => {
//     const requiredStep2 = [
//       "title",
//       "beneficiary",
//       "category",
//       "detail",
//       "location",
//       "amount",
//       "campaignImage",
//       "campaignDocs",
//     ];

//     const allFields = [
//       ...[
//         "fullName",
//         "email",
//         "phone",
//         "orgType",
//         "bankAcc",
//         "ifsc",
//       ],
//       ...requiredStep2,
//     ];

//     if (orgType === "Organization") {
//       allFields.push("orgName", "orgProof");
//     }

//     const valid = await trigger(allFields);
//     if (!valid) {
//       setStep(1);
//       return;
//     }

//     // Combined payload
//     const payload = {
//       page1: {
//         fullName: data.fullName,
//         email: data.email,
//         phone: data.phone,
//         orgType: data.orgType,
//         orgName: data.orgName || null,
//         bankAcc: data.bankAcc,
//         ifsc: data.ifsc,
//         orgProof: data.orgProof || null,
//       },
//       page2: {
//         title: data.title,
//         beneficiary: data.beneficiary,
//         category: data.category,
//         detail: data.detail,
//         location: data.location,
//         amount: data.amount,
//         campaignImage: data.campaignImage,
//         campaignDocs: data.campaignDocs,
//       },
//     };

//     console.log("FINAL SUBMIT DATA:", payload);
//     alert("Campaign created successfully!");
//   };


// //   const DropZone = ({ label, name, required, accept }) => {
// //   const file = watch(name);

// //   return (
// //     <div className="w-full mb-4">
// //       <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
// //         {label} {required && <span className="text-red-500">*</span>}
// //       </label>

// //       <div
// //         onDragOver={(e) => e.preventDefault()}
// //         onDrop={(e) => {
// //           e.preventDefault();
// //           const fileDropped = e.dataTransfer.files?.[0];
// //           handleFile(name, fileDropped);
// //         }}
// //         className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-white 
// //           ${errors[name] ? "border-red-500" : "border-gray-300 hover:border-purple-400"}
// //         `}
// //       >
// //         <div className="text-4xl mb-2">☁️</div>
// //         <p className="text-gray-600 text-sm">Choose a file or drag & drop it here</p>
// //         <p className="text-xs text-gray-400">JPEG, PNG, PDF, MP4 formats allowed</p>

// //         <label className="mt-3 cursor-pointer px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
// //           Browse File
// //           <input
// //             type="file"
// //             accept={accept}
// //             className="hidden"
// //             onChange={(e) => handleFile(name, e.target.files[0])}
// //           />
// //         </label>
// //       </div>

// //       {/* 📌 FILE NAME DISPLAY */}
// //       {file && (
// //         <p className="mt-2 text-sm text-gray-600">
// //           <span className="font-medium">Selected:</span> {file.name}
// //         </p>
// //       )}

// //       {errors[name] && (
// //         <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>
// //       )}
// //     </div>
// //   );
// // };



//   return (
//     <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4">
//       <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow">

//         {/* Title */}
//         <h1 className="text-4xl font-extrabold text-center mb-10">
//           Create Campaign
//         </h1>

//         <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">

//           {/* -------------------- STEP 1 -------------------- */}
//           {step === 1 && (
//             <>
//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("fullName", { required: "Full Name is required" })}
//                   placeholder="Enter Full Name"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.fullName ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.fullName && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.fullName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Email ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("email", { required: "Email is required" })}
//                   placeholder="Enter Email ID"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("phone", { required: "Phone Number is required" })}
//                   placeholder="Enter Phone Number"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.phone ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Organization / Individual <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("orgType", { required: "Selection is required" })}
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.orgType ? "border-red-500" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select option</option>
//                   <option value="Organization">Organization</option>
//                   <option value="Individual">Individual</option>
//                 </select>
//                 {errors.orgType && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.orgType.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Organization Name
//                   {orgType === "Organization" && (
//                     <span className="text-red-500">*</span>
//                   )}
//                 </label>
//                 <input
//                   {...register("orgName", {
//                     required:
//                       orgType === "Organization"
//                         ? "Organization Name is required"
//                         : false,
//                   })}
//                   placeholder="Enter Organization Name"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.orgName ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.orgName && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.orgName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Bank Account Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("bankAcc", {
//                     required: "Bank Account Number is required",
//                   })}
//                   placeholder="Enter Bank Account Number"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.bankAcc ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.bankAcc && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.bankAcc.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   IFSC Code <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("ifsc", { required: "IFSC Code is required" })}
//                   placeholder="Enter IFSC Code"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.ifsc ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.ifsc && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.ifsc.message}
//                   </p>
//                 )}
//               </div>

//               {/* Org proof */}
//               <DropZone
//            label="Organization Proof"
//            name="orgProof"
//            required={orgType === "Organization"}
//            accept="image/*,.pdf"
  
//           register={register}
//   errors={errors}
//   setValue={setValue}
//   watch={watch}
// />
//               <input
//                 type="hidden"
//                 {...register("orgProof", {
//                   required:
//                     orgType === "Organization"
//                       ? "Organization Proof is required"
//                       : false,
//                 })}
//               />

//               {/* NEXT BUTTON */}
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}

//           {/* -------------------- STEP 2 -------------------- */}
//           {step === 2 && (
//             <>
//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Campaign Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("title", { required: "Campaign Title is required" })}
//                   placeholder="Enter title"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.title ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.title && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.title.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Beneficiary Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("beneficiary", {
//                     required: "Beneficiary Name is required",
//                   })}
//                   placeholder="Enter beneficiary name"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.beneficiary ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.beneficiary && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.beneficiary.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("category", {
//                     required: "Category is required",
//                   })}
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.category ? "border-red-500" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Education">Education</option>
//                   <option value="Health">Health</option>
//                   <option value="Disaster Relief">Disaster Relief</option>
//                 </select>
//                 {errors.category && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.category.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Detailed Explanation <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   {...register("detail", {
//                     required: "Detailed explanation is required",
//                   })}
//                   rows="4"
//                   placeholder="Describe your campaign"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.detail ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.detail && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.detail.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Location <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("location", {
//                     required: "Location is required",
//                   })}
//                   placeholder="Enter location"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.location ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.location && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.location.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm text-gray-700 flex items-center gap-1">
//                   Target Amount (₹) <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   {...register("amount", {
//                     required: "Target amount is required",
//                   })}
//                   placeholder="Enter amount"
//                   className={`w-full mt-1 p-3 border rounded-md ${
//                     errors.amount ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.amount && (
//                   <p className="text-xs text-red-500 mt-1">
//                     {errors.amount.message}
//                   </p>
//                 )}
//               </div>

//              <DropZone
//               label="Campaign Image"
//               name="campaignImage"
//               required={true}
//               accept="image/*"
//               register={register}
//               errors={errors}
//              setValue={setValue}
//                 watch={watch}
// />
//               <input
//                 type="hidden"
//                 {...register("campaignImage", {
//                   required: "Campaign Image is required",
//                 })}
//               />

//               <DropZone
//                   label="Campaign Proof"
//                   name="CampProof"
//                   required={true}
//                   accept="image/*,.pdf"
//                   register={register}
//                   errors={errors}
//                   setValue={setValue}
//                   watch={watch}
// />
//               <input
//                 type="hidden"
//                 {...register("campaignDocs", {
//                   required: "Campaign Documents are required",
//                 })}
//               />

//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={backStep}
//                   className="px-6 py-2 border rounded-lg hover:bg-gray-100"
//                 >
//                   Back
//                 </button>

//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Create Campaign
//                 </button>
//               </div>
//             </>
//           )}

//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DropZone from "../components/reusable/dropfile.jsx";
import Swal from 'sweetalert2'
import api from '../api/api.js'
import { useSelector } from "react-redux";


export default function CreateCampaign() {
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
  
  const userName = useSelector((state)=> state.auth.userName)
  const userEmail = useSelector((state)=> state.auth.userEmail)
  const [step, setStep] = useState(1);
  const orgType = watch("orgType");

  // set file into RHF and keep file name visible via watch
  const handleFile = (name, file) => {
    setValue(name, file || null, { shouldValidate: true, shouldTouch: true });
  };

  // Step1 -> Step2: validate only step1 fields (conditional)
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

  // Validate everything
  const ok = await trigger(validateFields);
  if (!ok) {
    setStep(1);
    return;
  }

  // 🎯 SweetAlert confirmation
  const result = await Swal.fire({
    title: "Confirm Submission",
    text: "Once submitted, this campaign cannot be edited. Continue?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Submit",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  // ---------------- FormData build ----------------
  const formData = new FormData();

  // Backend-exact fields
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


  // bankDetails
  formData.append("bankAcc", data.bankAcc);
  formData.append("IFSCCode", data.ifsc);


  try {
     await api.post("/campaign/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials:true,
    });

    Swal.fire({
      title: "Success!",
      text: "Campaign has been created successfully.",
      icon: "success",
    });

  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: err.response?.data?.message || "Something went wrong.",
      icon: "error",
    });
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-4xl font-extrabold text-center mb-8">Create Campaign</h1>

        {/* noValidate disables browser's native validation popups */}
        <form noValidate onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">

          {/* ---------- STEP 1 ---------- */}
          {step === 1 && (
            <>
              {/* Full Name */}
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

              {/* Email */}
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

              {/* Phone */}
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

              {/* Org Type */}
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

              {/* Organization Name (conditionally required) */}
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

              {/* Bank Account */}
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

              {/* IFSC */}
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

              {/* Organization Proof DropZone */}
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
              {/* Hidden registration for orgProof so RHF can validate it conditionally */}
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

          {/* ---------- STEP 2 ---------- */}
          {step === 2 && (
            <>
              {/* Campaign Title */}
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

              {/* Beneficiary */}
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

              {/* Category */}
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

              {/* Detailed Explanation (Step 2) */}
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

              {/* Location */}
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

              {/* Target Amount */}
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

              {/* Campaign Image DropZone */}
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

              {/* Campaign Documents DropZone */}
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
  );
}

