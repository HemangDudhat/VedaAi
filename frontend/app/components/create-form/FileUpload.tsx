"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateFormStore } from "@/store/useCreateFormStore";
import { Upload, File as FileIcon, X, AlertCircle } from "lucide-react";

export default function FileUpload() {
  const { files, setFiles, error } = useCreateFormStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newFiles = [...files, ...acceptedFiles].slice(0, 5); // Max 5 files
        setFiles(newFiles);
      }
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: 20 * 1024 * 1024, // 20MB
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const removeFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
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

        {files.length > 0 ? (
          // Files Selected State
          <div className="w-full">
            <h3 className="font-semibold text-text-primary mb-4 text-center">
              Uploaded Files ({files.length}/5)
            </h3>
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 animate-scale-in w-full max-w-sm mx-auto">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex shrink-0 items-center justify-center text-blue-500">
                      <FileIcon size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-text-primary font-medium text-sm truncate w-40 sm:w-48 text-left">
                        {file.name}
                      </p>
                      <p className="text-text-secondary text-xs text-left">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => removeFile(e, idx)}
                    className="p-2 text-text-muted hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            {files.length < 5 && (
              <p className="text-sm text-text-secondary mt-6 text-center">
                Click or drag to add more files (up to 5)
              </p>
            )}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-accent-orange">
              <Upload size={28} />
            </div>
            <p className="text-text-primary font-semibold text-lg mb-2">
              Drag & Drop your files here
            </p>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              or click to browse from your computer (Up to 5 files)
            </p>
            
            <div className="flex items-center gap-4 text-xs text-text-muted font-medium bg-gray-50 px-4 py-2 rounded-lg border border-border-light">
              <span>PDF, TXT, JPG, PNG</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Max 20MB total</span>
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

      {error && files.length === 0 && (
        <p className="mt-3 text-accent-red text-sm font-medium flex items-center gap-1.5 justify-center animate-slide-up">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
}
