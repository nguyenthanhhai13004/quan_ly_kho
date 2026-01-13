import { useState, useRef, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { CiImageOn } from "react-icons/ci";

export default function CustomImageInput({
  label = "Tải ảnh lên",
  onChange,
  defaultImage,
  required=false
}: {
  label?: string;
  onChange?: (file?: File) => void;
  defaultImage?: string;
  required?:boolean
}) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(undefined);
  };

  useEffect(() => {
    setPreview(defaultImage || null);
  }, [defaultImage]);

  return (
    <div className="flex relative flex-col gap-2 items-start">
      {label && <label className="bg-[#F5F4F9] text-gray-700 absolute z-10 text-xs font-medium">{label}
         {required && (
                <span className="text-[#d15b47] inline-block ml-1">(*)</span>
              )}
        </label>}
      
      <div className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 w-48 h-48 flex items-center justify-center bg-gray-50 hover:border-blue-400 transition">
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-red-100"
            >
              <CgClose size={16} className="text-red-500 cursor-pointer"/>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-500"
          >
            <CiImageOn className="cursor-pointer" size={32} />
            <span className="text-xs mt-1 cursor-pointer">{label}</span>
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelectFile}
        />
      </div>
    </div>
  );
}
