"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, FileImage, Loader2 } from "lucide-react";
import { libraryApi } from "@/lib/api";
import { LibraryDocument } from "@/types";
import { useCreateFormStore } from "@/store/useCreateFormStore";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LibraryModal({ isOpen, onClose }: LibraryModalProps) {
  const { libraryFiles, setLibraryFiles } = useCreateFormStore();
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      // Pre-select currently chosen ones
      const currentIds = new Set(libraryFiles.map((doc) => doc._id));
      setSelectedIds(currentIds);
    }
  }, [isOpen, libraryFiles]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await libraryApi.list();
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to load library documents", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (docId: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(docId)) {
      newSet.delete(docId);
    } else {
      if (newSet.size + useCreateFormStore.getState().files.length >= 5) {
        alert("Maximum 5 total files allowed.");
        return;
      }
      newSet.add(docId);
    }
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    const selectedDocs = documents.filter((doc) => selectedIds.has(doc._id));
    setLibraryFiles(selectedDocs);
    onClose();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;
  if (!mounted) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Select from My Library</h2>
            <p className="text-sm text-text-secondary mt-1">
              Choose documents from your library to include in this assignment.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">
              <p>Your library is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const isSelected = selectedIds.has(doc._id);
                return (
                  <div
                    key={doc._id}
                    onClick={() => toggleSelect(doc._id)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                      ${isSelected ? "border-accent-orange bg-orange-50/50" : "border-border-light hover:border-text-muted bg-white"}
                    `}
                  >
                    <div className="flex items-center justify-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "bg-accent-orange border-accent-orange text-white" : "border-border-light"}`}>
                        {isSelected && <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg shrink-0 ${doc.fileType.includes("image") ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                      {doc.fileType.includes("image") ? <FileImage size={24} /> : <FileText size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm truncate">{doc.fileName}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{formatBytes(doc.fileSize)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border-light flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-accent-orange hover:bg-orange-600 rounded-xl transition-colors shadow-sm"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
