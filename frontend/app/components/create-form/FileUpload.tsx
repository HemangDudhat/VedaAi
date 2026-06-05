"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateFormStore } from "@/store/useCreateFormStore";
import { Upload, File as FileIcon, X, AlertCircle, Library } from "lucide-react";
import LibraryModal from "../library/LibraryModal";
import { useState } from "react";

export default function FileUpload() {
  const { files, setFiles, libraryFiles, setLibraryFiles, error, filePageRanges, setFilePageRange } = useCreateFormStore();
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  
  const totalFiles = files.length + libraryFiles.length;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const slotsLeft = 5 - libraryFiles.length;
        const newFiles = [...files, ...acceptedFiles].slice(0, slotsLeft);
        setFiles(newFiles);
      }
    },
    [files, libraryFiles, setFiles]
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

  const removeFile = (e: React.MouseEvent, index: number, isLibraryDoc: boolean = false) => {
    e.stopPropagation();
    if (isLibraryDoc) {
      const newLibFiles = [...libraryFiles];
      newLibFiles.splice(index, 1);
      setLibraryFiles(newLibFiles);
    } else {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    }
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

        {totalFiles > 0 ? (
          // Files Selected State
          <div className="w-full">
            <h3 className="font-semibold text-text-primary mb-4 text-center">
              Selected Files ({totalFiles}/5)
            </h3>
            <div className="space-y-3">
              {/* Fresh Uploads */}
              {files.map((file, idx) => {
                const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
                const fileId = `${file.name}-${file.size}`;
                const pageRange = filePageRanges[fileId] || {};

                return (
                  <div
                    key={idx}
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col p-3 bg-blue-50/50 rounded-xl border border-blue-100 animate-scale-in w-full max-w-sm mx-auto cursor-default"
                  >
                    <div className="flex items-center justify-between w-full">
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

                    {isPdf && (
                      <div className="mt-3 flex items-center gap-2 pl-[3.25rem] border-t border-blue-100/50 pt-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-semibold text-text-muted uppercase mb-1">Start Page</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 4"
                            value={pageRange.start || ""}
                            onChange={(e) => setFilePageRange(fileId, { ...pageRange, start: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-16 h-8 text-xs px-2 border border-border-light rounded focus:outline-none focus:border-accent-orange bg-white"
                          />
                        </div>
                        <span className="text-text-muted mt-4">-</span>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-semibold text-text-muted uppercase mb-1">End Page</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 8"
                            value={pageRange.end || ""}
                            onChange={(e) => setFilePageRange(fileId, { ...pageRange, end: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-16 h-8 text-xs px-2 border border-border-light rounded focus:outline-none focus:border-accent-orange bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Library Documents */}
              {libraryFiles.map((doc, idx) => {
                const isPdf = doc.fileType === "application/pdf" || doc.fileName.endsWith(".pdf");
                const fileId = `lib-${doc._id}`;
                const pageRange = filePageRanges[fileId] || {};

                return (
                  <div
                    key={fileId}
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col p-3 bg-purple-50/50 rounded-xl border border-purple-100 animate-scale-in w-full max-w-sm mx-auto cursor-default"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex shrink-0 items-center justify-center text-purple-600">
                          <Library size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-text-primary font-medium text-sm truncate w-40 sm:w-48 text-left">
                            {doc.fileName}
                          </p>
                          <p className="text-text-secondary text-xs text-left">
                            {formatBytes(doc.fileSize)} • From Library
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeFile(e, idx, true)}
                        className="p-2 text-text-muted hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {isPdf && (
                      <div className="mt-3 flex items-center gap-2 pl-[3.25rem] border-t border-purple-100/50 pt-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-semibold text-text-muted uppercase mb-1">Start Page</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 4"
                            value={pageRange.start || ""}
                            onChange={(e) => setFilePageRange(fileId, { ...pageRange, start: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-16 h-8 text-xs px-2 border border-border-light rounded focus:outline-none focus:border-accent-orange bg-white"
                          />
                        </div>
                        <span className="text-text-muted mt-4">-</span>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-semibold text-text-muted uppercase mb-1">End Page</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 8"
                            value={pageRange.end || ""}
                            onChange={(e) => setFilePageRange(fileId, { ...pageRange, end: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-16 h-8 text-xs px-2 border border-border-light rounded focus:outline-none focus:border-accent-orange bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {totalFiles < 5 && (
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

      <div className="mt-6 flex justify-center animate-fade-in">
        <button
          onClick={() => setIsLibraryModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm font-semibold text-sm border border-blue-200"
        >
          <Library size={18} />
          Browse My Library
        </button>
      </div>

      <LibraryModal isOpen={isLibraryModalOpen} onClose={() => setIsLibraryModalOpen(false)} />

      {error && totalFiles === 0 && (
        <p className="mt-3 text-accent-red text-sm font-medium flex items-center gap-1.5 justify-center animate-slide-up">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
}
