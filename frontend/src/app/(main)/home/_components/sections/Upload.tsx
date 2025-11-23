// app/components/FileUpload.tsx
"use client";
import { useState, useRef } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return alert("Please select a file first!");
    // handle file submission (upload to backend)
    console.log("Submitting file:", file);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <p className="text-gray-700 dark:text-gray-300">{file.name}</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Drag & drop a file here, or click to select
          </p>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Submit
      </button>
    </div>
  );
}
