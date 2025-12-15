// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import DropZone from "../reusable/dropfile";

// export default function EventFormAdmin({
//   register,
//   errors,
//   setValue,
//   watch,
//   editing = false,
//   eventData = {},
// }) {
//   const [existingImages, setExistingImages] = useState([]);
//   const [removedImages, setRemovedImages] = useState([]);
//   const { adminName, adminEmail } = useSelector((state) => state.adminAuth);

//   // Prefill fields when editing
//   useEffect(() => {
//     if (editing && eventData) {
//       const fields = [
//         "fullName",
//         "email",
//         "title",
//         "description",
//         "category",
//         "venue",
//         "eventTime",
//         "duration",
//         "ticketPrice",
//         "totalTickets",
//         "date",
//       ];

//       fields.forEach((fld) => {
//         if (eventData[fld]) setValue(fld, eventData[fld]);
//       });

//       if (eventData.images && Array.isArray(eventData.images)) {
//         setExistingImages(eventData.images);
//       }
//     }
//   }, [editing, eventData, setValue]);

//   // Remove existing image
//   const removeExistingImage = (img) => {
//     setRemovedImages([...removedImages, img]);
//     setExistingImages(existingImages.filter((i) => i !== img));
//   };

//   const handleFile = (name, file) => {
//     setValue(name, file, { shouldValidate: true });
//   };

//   return (
//     <div className="space-y-6">
//       {/* PERSONAL INFO */}
//       <div>
//         <label className="text-sm">
//           Full Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("fullName", {
//             required: "Full Name is required",
//             validate: (v) => v.trim() !== "" || "Full Name cannot be empty",
//           })}
//           value={adminName}
//           className="w-full mt-1 p-3 border rounded-md"
//         />
//         {errors.fullName && (
//           <p className="text-red-500 text-xs">{errors.fullName.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Email <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="email"
//           {...register("email", {
//             required: "Email is required",
//             validate: (v) => v.trim() !== "" || "Email cannot be empty",
//           })}
//           className="w-full mt-1 p-3 border rounded-md"
//           value={adminEmail}
//         />
//         {errors.email && (
//           <p className="text-red-500 text-xs">{errors.email.message}</p>
//         )}
//       </div>

//       {/* EVENT DETAILS */}

//       <div>
//         <label className="text-sm">
//           Event Title <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("title", {
//             required: "Event title is required",
//             validate: (v) => v.trim() !== "" || "Event Title cannot be empty",
//           })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.title && (
//           <p className="text-red-500 text-xs">{errors.title.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Description <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           {...register("description", {
//             required: "Description is required",
//             validate: (v) => v.trim() !== "" || "Description cannot be empty",
//           })}
//           rows={5}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.description && (
//           <p className="text-red-500 text-xs">{errors.description.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm text-gray-700 flex items-center gap-1">
//           Category <span className="text-red-500">*</span>
//         </label>
//         <select
//           {...register("category", {
//             required: "Category is required",
//           })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         >
//           <option value="">Select Category</option>
//           <option value="Education">Education</option>
//           <option value="Health">Health</option>
//           <option value="Technology">Technology</option>
//           <option value="Other">Other</option>
//         </select>
//         {errors.category && (
//           <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Venue <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("venue", {
//             required: "Venue is required",
//             validate: (v) => v.trim() !== "" || "Venue cannot be empty",
//           })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.venue && (
//           <p className="text-red-500 text-xs">{errors.venue.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Event Time <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="time"
//           {...register("eventTime", { required: "Event time is required" })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.eventTime && (
//           <p className="text-red-500 text-xs">{errors.eventTime.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Event Date <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="date"
//           {...register("date", { required: "Event date is required" })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.date && (
//           <p className="text-red-500 text-xs">{errors.date.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Duration (in hours) <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           {...register("duration", { required: "Duration is required" })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.duration && (
//           <p className="text-red-500 text-xs">{errors.duration.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Ticket Price (₹) <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           {...register("ticketPrice", { required: "Ticket Price is required" })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.ticketPrice && (
//           <p className="text-red-500 text-xs">{errors.ticketPrice.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="text-sm">
//           Total Tickets <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           {...register("totalTickets", { required: "Total tickets required" })}
//           className={`w-full mt-1 p-3 border rounded-md ${
//             errors.category ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.totalTickets && (
//           <p className="text-red-500 text-xs">{errors.totalTickets.message}</p>
//         )}
//       </div>

//       {/* EXISTING IMAGES */}
//       {editing && existingImages.length > 0 && (
//         <div>
//           <p className="text-sm mb-2 font-semibold">Existing Images</p>
//           <div className="flex flex-wrap gap-3">
//             {existingImages.map((img) => (
//               <div key={img} className="relative">
//                 <img
//                   src={img}
//                   className="h-24 w-24 object-cover rounded border"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeExistingImage(img)}
//                   className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* NEW IMAGE UPLOAD */}
//       <DropZone
//         label="Event Images"
//         name="eventImages"
//         accept="image/*"
//         register={register("eventImages", {
//           validate: () => {
//             const hasExisting = existingImages.length > 0;
//             const newFile = watch("eventImages");

//             if (!editing && !newFile) return "Event images are required";

//             if (editing && !hasExisting && !newFile)
//               return "Please upload at least one image";

//             return true;
//           },
//         })}
//         errors={errors}
//         watch={watch}
//         setValue={setValue}
//         handleFile={handleFile}
//       />

//       {/* SUBMIT BUTTON */}
//       <div className="flex justify-end mt-6">
//         <button
//           type="submit"
//           className="px-6 py-2 bg-green-600 text-white rounded-lg"
//         >
//           {editing ? "Update Event" : "Create Event"}
//         </button>
//       </div>

//       {/* Removed images (for backend) */}
//       <input
//         type="hidden"
//         {...register("removedImages")}
//         value={removedImages}
//       />
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DropZone from "../reusable/dropfile";

export default function EventFormAdmin({
  register,
  errors,
  setValue,
  watch,
  editing = false,
  eventData = {},
}) {
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const { adminName, adminEmail } = useSelector((state) => state.adminAuth);

  // Prefill fields when editing
  useEffect(() => {
     if (editing && eventData) {
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

      fields.forEach((fld) => {
        if (eventData[fld]) {
          if (fld === "date") {
            setValue("date", eventData.date?.split("T")[0]); 
          } else {
            setValue(fld, eventData[fld]);
          }
        }
      });

      if (Array.isArray(eventData.images)) {
        setExistingImages(eventData.images);
      }
    }
  }, [editing, eventData, setValue]);

  // Remove existing image
  const removeExistingImage = (img) => {
    setRemovedImages([...removedImages, img]);
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  // Handle NEW FILE UPLOAD with preview
  const handleFile = (name, file) => {
    setValue(name, file, { shouldValidate: true });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNewImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setNewImagePreview(null);
    }
  };

  return (
    <div className="space-y-6">
          <div>
        <label className="text-sm">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName", {
            required: "Full Name is required",
            validate: (v) => v.trim() !== "" || "Full Name cannot be empty",
          })}
          value={adminName}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            validate: (v) => v.trim() !== "" || "Email cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
          value={adminEmail}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* EVENT TITLE */}
      <div>
        <label className="text-sm">Event Title <span className="text-red-500">*</span></label>
        <input
          {...register("title", {
            required: "Event title is required",
            validate: (v) => v.trim() !== "" || "Event Title cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={5}
          {...register("description", {
            required: "Description is required",
            validate: (v) => v.trim() !== "" || "Description cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm">Category <span className="text-red-500">*</span></label>
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
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
      </div>

      {/* VENUE */}
      <div>
        <label className="text-sm">Venue <span className="text-red-500">*</span></label>
        <input
          {...register("venue", {
            required: "Venue is required",
            validate: (v) => v.trim() !== "" || "Venue cannot be empty",
          })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
      </div>

      {/* TIME */}
      <div>
        <label className="text-sm">Event Time <span className="text-red-500">*</span></label>
        <input
          type="time"
          {...register("eventTime", { required: "Event time is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.eventTime && <p className="text-red-500 text-xs">{errors.eventTime.message}</p>}
      </div>

      {/* DATE */}
      <div>
        <label className="text-sm">Event Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          {...register("date", { required: "Event date is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
      </div>

      {/* DURATION */}
      <div>
        <label className="text-sm">Duration (in hours) <span className="text-red-500">*</span></label>
        <input
          type="number"
          {...register("duration", { required: "Duration is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
      </div>

      {/* TICKET PRICE */}
      <div>
        <label className="text-sm">Ticket Price (₹) <span className="text-red-500">*</span></label>
        <input
          type="number"
          {...register("ticketPrice", { required: "Ticket Price is required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.ticketPrice && <p className="text-red-500 text-xs">{errors.ticketPrice.message}</p>}
      </div>

      {/* TOTAL TICKETS */}
      <div>
        <label className="text-sm">Total Tickets <span className="text-red-500">*</span></label>
        <input
          type="number"
          {...register("totalTickets", { required: "Total tickets required" })}
          className="w-full mt-1 p-3 border rounded-md"
        />
        {errors.totalTickets && <p className="text-red-500 text-xs">{errors.totalTickets.message}</p>}
      </div>

      {/* EXISTING IMAGES WHEN EDITING */}
      {editing && existingImages.length > 0 && (
        <div>
          <p className="text-sm mb-2 font-semibold">Existing Event Images</p>

          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  className="h-24 w-24 object-cover rounded border"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW IMAGE UPLOAD */}
      <DropZone
        label="Upload New Image"
        name="eventImages"
        accept="image/*"
        register={register("eventImages")}
        errors={errors}
        watch={watch}
        setValue={setValue}
        handleFile={handleFile}
      />

      {/* NEW IMAGE PREVIEW */}
      {newImagePreview && (
        <div className="mt-3">
          <p className="text-sm font-semibold">New Image Preview:</p>
          <img
            src={newImagePreview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded border"
          />
        </div>
      )}

      {/* Hidden removed images list */}
      <input type="hidden" {...register("removedImages")} value={removedImages} />

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          {editing ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
}
