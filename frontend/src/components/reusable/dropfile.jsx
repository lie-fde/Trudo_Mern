import React from "react";

export default function DropZone({
  label,
  name,
  required,
  accept,
  register,
  errors,
  setValue,
  watch
}) {
  const file = watch(name);

  const handleFile = (file) => {
    setValue(name, file, { shouldValidate: true, shouldTouch: true });
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm text-gray-700 flex items-center gap-1 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files?.[0];
          handleFile(dropped);
        }}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-white 
          ${errors[name] ? "border-red-500" : "border-gray-300 hover:border-purple-400"}`}
      >
        <div className="text-4xl mb-2">☁️</div>
        <p className="text-gray-600 text-sm">Choose a file or drag & drop it here</p>
        <p className="text-xs text-gray-400">JPEG, PNG, PDF, MP4 allowed</p>

        <label className="mt-3 cursor-pointer px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
          Browse File
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </label>
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Selected:</span> {file.name}
        </p>
      )}

      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
