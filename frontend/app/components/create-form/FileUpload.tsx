"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateFormStore } from "@/store/useCreateFormStore";
import { Upload, File as FileIcon, X, AlertCircle } from "lucide-react";

export default function FileUpload() {
  const { file, setFile, error } = useCreateFormStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Upload Reference Material
        </h2>
        <p className="text-text-secondary text-sm">
          Upload a PDF, Text, or Image file containing the study material or textbook chapter. The AI will use this to generate relevant questions.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10
          flex flex-col items-center justify-center
          transition-all duration-200 cursor-pointer
          bg-bg-white min-h-[300px]
          ${
            isDragActive && !isDragReject
              ? "border-accent-orange bg-orange-50/50"
              : isDragReject
              ? "border-accent-red bg-red-50/50"
              : "border-border hover:border-text-muted hover:bg-gray-50/50"
          }
          ${error ? "border-accent-red" : ""}
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          // File Selected State
          <div className="flex flex-col items-center text-center animate-scale-in">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500 shadow-sm border border-blue-100">
              <FileIcon size={32} />
            </div>
            <p className="text-text-primary font-semibold text-lg mb-1 max-w-sm truncate">
              {file.name}
            </p>
            <p className="text-text-secondary text-sm mb-6">
              {formatBytes(file.size)}
            </p>
            <button
              onClick={removeFile}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-accent-red rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <X size={16} />
              Remove File
            </button>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-accent-orange">
              <Upload size={28} />
            </div>
            <p className="text-text-primary font-semibold text-lg mb-2">
              Drag & Drop your file here
            </p>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              or click to browse from your computer
            </p>
            
            <div className="flex items-center gap-4 text-xs text-text-muted font-medium bg-gray-50 px-4 py-2 rounded-lg border border-border-light">
              <span>PDF, TXT, JPG, PNG</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Max 10MB</span>
            </div>
          </div>
        )}

        {isDragReject && (
          <div className="absolute bottom-4 flex items-center gap-2 text-accent-red text-sm font-medium animate-slide-up">
            <AlertCircle size={16} />
            File type not supported or file too large
          </div>
        )}
      </div>

      {error && !file && (
        <p className="mt-3 text-accent-red text-sm font-medium flex items-center gap-1.5 justify-center animate-slide-up">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
}
