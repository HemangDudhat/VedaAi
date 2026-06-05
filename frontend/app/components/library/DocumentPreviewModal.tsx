"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, FileImage } from "lucide-react";
import { LibraryDocument } from "@/types";

interface DocumentPreviewModalProps {
  document: LibraryDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !document) return null;
  if (!mounted) return null;

  const getFileUrl = (filePath: string) => {
    // Replace all backslashes with forward slashes
    const normalizedPath = filePath.replace(/\\/g, "/");
    
    // Extract the portion starting from "uploads/" to handle absolute paths
    const uploadIndex = normalizedPath.indexOf("uploads/");
    const relativePath = uploadIndex !== -1 ? normalizedPath.substring(uploadIndex) : normalizedPath;
    
    // Get the base API URL (e.g. http://localhost:5000/api) and strip the trailing "/api"
    const apiUri = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const baseUri = apiUri.replace(/\/api$/, "");
    
    return `${baseUri}/${relativePath}`;
  };

  const isImage = document.fileType.includes("image");
  const isPdf = document.fileType === "application/pdf" || document.fileName.endsWith(".pdf");

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border-light bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isImage ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
              {isImage ? <FileImage size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <h2 className="font-bold text-text-primary text-base sm:text-lg max-w-lg truncate">
                {document.fileName}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">Previewing file from your library</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-muted hover:text-accent-red hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-gray-100 relative">
          {isImage ? (
            <div className="w-full h-full flex items-center justify-center p-8">
              <img 
                src={getFileUrl(document.filePath)} 
                alt={document.fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={`${getFileUrl(document.filePath)}#toolbar=0`}
              className="w-full h-full border-none"
              title={document.fileName}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p>Preview not available for this file type.</p>
              <a 
                href={getFileUrl(document.filePath)} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
