"use client";

import { usePipelineStore } from "@/hooks/use-pipeline-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileUpload05() {
  const { file, setFile } = usePipelineStore();

  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const removeFile = () => setFile(null);

  return (
    <div className="flex items-center justify-center p-10 w-full">
      <form>
        <h3 className="text-4xl font-semibold text-foreground font-heading">File Upload</h3>

        <div
          className={cn(
            "mt-4 flex justify-center space-x-4 rounded-md border border-dashed border-input px-6 py-10 transition-colors w-4xl",
            dragActive && "bg-accent/20 border-primary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="sm:flex sm:items-center sm:gap-x-3">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground sm:mx-0 sm:h-6 sm:w-6" />

            <div className="mt-4 flex text-sm leading-6 text-foreground sm:mt-0">
              <p>Drag and drop or</p>

              <Label
                htmlFor="file-upload-input"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary underline underline-offset-4"
              >
                <span>choose file</span>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>

              <p className="pl-1">to upload</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="relative mt-8 rounded-lg p-3 border-1">
            <div className="absolute right-1 top-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-input">
                <FileSpreadsheet className="size-5" />
              </span>

              <div className="w-full overflow-hidden">
                <p className="truncate text-xs font-medium">{file.name}</p>
                <p className="mt-0.5 flex justify-between text-xs text-muted-foreground">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>Ready to upload</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => setFile(null)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
