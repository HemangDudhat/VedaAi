"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import MobileNavBar from "../components/layout/MobileNavBar";
import { useAuthStore } from "@/store/useAuthStore";
import { libraryApi } from "@/lib/api";
import { LibraryDocument } from "@/types";
import { Loader2, FileText, Trash2, Upload, Search, FileImage } from "lucide-react";
import { useDropzone } from "react-dropzone";
import DocumentPreviewModal from "../components/library/DocumentPreviewModal";

export default function LibraryPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isInitialized, user } = useAuthStore();
  
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<LibraryDocument | null>(null);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth/login");
    }
  }, [isInitialized, user, router]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await libraryApi.list();
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch library documents", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    try {
      await libraryApi.upload(acceptedFiles);
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to upload document", err);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 20 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await libraryApi.delete(id);
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isInitialized || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <Loader2 size={32} className="text-accent-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title="My Library"
          showBack={false}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-orange animate-pulse-dot" />
                  <h1 className="text-xl font-bold text-text-primary">Document Hub</h1>
                </div>
                <p className="text-sm text-text-secondary ml-5">
                  Manage your textbooks, syllabus, and reference materials.
                </p>
              </div>

              {/* Upload Zone (Small) */}
              <div 
                {...getRootProps()} 
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed cursor-pointer
                  transition-all duration-200
                  ${isDragActive ? "border-accent-orange bg-orange-50" : "border-border-light bg-white hover:border-text-muted"}
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input {...getInputProps()} disabled={isUploading} />
                {isUploading ? (
                  <Loader2 size={20} className="animate-spin text-accent-orange" />
                ) : (
                  <Upload size={20} className="text-text-secondary" />
                )}
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </p>
                  <p className="text-xs text-text-muted">PDF, TXT, Images up to 20MB</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search documents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all shadow-sm"
              />
            </div>

            {/* Document Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-accent-orange animate-spin mb-3" />
                <p className="text-sm text-text-secondary">Loading library...</p>
              </div>
            ) : filteredDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc._id} 
                    onClick={() => setPreviewDoc(doc)}
                    className="bg-white border border-border-light rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow group animate-fade-in cursor-pointer"
                  >
                    <div className={`p-3 rounded-lg shrink-0 ${doc.fileType.includes("image") ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                      {doc.fileType.includes("image") ? <FileImage size={24} /> : <FileText size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary text-sm truncate" title={doc.fileName}>
                        {doc.fileName}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {formatBytes(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc._id);
                      }}
                      className="p-2 text-text-muted hover:text-accent-red hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Delete Document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-border-light rounded-2xl shadow-sm animate-fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                  <FileText size={28} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {searchQuery ? "No matching documents" : "Your library is empty"}
                </h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto">
                  {searchQuery ? "Try a different search term." : "Upload textbooks, syllabus, or notes to reuse them across multiple assignments."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNavBar />
      
      <DocumentPreviewModal 
        document={previewDoc} 
        isOpen={!!previewDoc} 
        onClose={() => setPreviewDoc(null)} 
      />
    </div>
  );
}
