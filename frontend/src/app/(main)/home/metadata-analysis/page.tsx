"use client";

import { opencvApi } from "@/features/opencv/api/opencv.api";
import { useRef, useState } from "react";

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    opencvApi.evaluate(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={fileInputRef} />

        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
