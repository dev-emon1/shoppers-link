import React, { useRef, useMemo } from "react";
import { UploadCloud } from "lucide-react";

const ImageUploader = ({
  multiple = false,
  onFileSelect,
  maxSizeMB = 2,
  validateDimensions = true,
  minWidth = 100,
  minHeight = 100,
  uploaderId,
}) => {
  const inputRef = useRef(null);
  const uniqueId = useMemo(
    () => uploaderId || `file-input-${crypto.randomUUID()}`,
    [uploaderId]
  );

  const validateFile = (file) =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/"))
        return reject("Only image files allowed");
      if (file.size > maxSizeMB * 1024 * 1024)
        return reject(`File must be under ${maxSizeMB}MB`);

      if (!validateDimensions) return resolve(file);

      const img = new Image();
      const tmpUrl = URL.createObjectURL(file);
      img.onload = () => {
        const ok = img.width >= minWidth && img.height >= minHeight;
        URL.revokeObjectURL(tmpUrl);
        if (!ok) reject(`Minimum ${minWidth}x${minHeight}px required`);
        else resolve(file);
      };
      img.onerror = () => {
        URL.revokeObjectURL(tmpUrl);
        reject("Invalid image file");
      };
      img.src = tmpUrl;
    });

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const validFiles = [];
    for (const file of files) {
      try {
        const valid = await validateFile(file);
        validFiles.push(valid);
      } catch (err) {
        alert(err);
      }
    }
    if (validFiles.length && onFileSelect)
      onFileSelect(multiple ? validFiles : validFiles[0]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:border-main hover:bg-main/5 transition-all duration-200"
    >
      <input
        key={uniqueId}
        id={uniqueId}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <label
        htmlFor={uniqueId}
        className="flex flex-col items-center text-center cursor-pointer"
      >
        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-gray-600 text-xs mb-1">
          Drag & drop or <span className="text-main font-medium">browse</span>
        </p>
      </label>
    </div>
  );
};

export default ImageUploader;
