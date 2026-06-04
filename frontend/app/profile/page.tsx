"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/layout/Sidebar";
import TopBar from "@/app/components/layout/TopBar";
import MobileNavBar from "@/app/components/layout/MobileNavBar";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfileApi, getImageKitAuthApi } from "@/lib/auth";
import { Loader2, Camera, School, User, MapPin, FileText, Check } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, isInitialized } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolProfile, setSchoolProfile] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInitialized && !user) router.replace("/auth/login");
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setSchoolName(user.schoolName || "");
      setSchoolAddress(user.schoolAddress || "");
      setSchoolProfile(user.schoolProfile || "");
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const authParams = await getImageKitAuthApi();
      const ikPublicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      const ikUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

      if (!ikPublicKey || !ikUrlEndpoint) {
        // Fallback: just use object URL locally for preview
        setProfileImageUrl(URL.createObjectURL(file));
        setError("ImageKit not configured yet. Image preview shown locally.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `profile_${Date.now()}`);
      formData.append("publicKey", ikPublicKey);
      formData.append("signature", authParams.signature);
      formData.append("expire", authParams.expire);
      formData.append("token", authParams.token);

      const uploadRes = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");
      setProfileImageUrl(uploadData.url);
    } catch (err: any) {
      setError(err.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const data = await updateProfileApi({
        firstName, lastName, profileImageUrl,
        schoolName, schoolAddress, schoolProfile,
      });
      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?";

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
        <TopBar title="Profile Settings" showBack onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">

            {/* Header */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-orange animate-pulse-dot" />
                <h1 className="text-xl font-bold text-text-primary">Profile Settings</h1>
              </div>
              <p className="text-sm text-text-secondary ml-5">Update your personal and school information.</p>
            </div>

            {/* Profile Image Card */}
            <div className="bg-bg-white rounded-2xl border border-border-light p-6 shadow-sm animate-slide-up">
              <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
                <User size={16} className="text-accent-orange" /> Profile Photo
              </h2>
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-sm border-2 border-white">
                    {profileImageUrl && !profileImageUrl.startsWith("blob:") ? (
                      <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : profileImageUrl.startsWith("blob:") ? (
                      <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{initials}</span>
                    )}
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    <Camera size={16} />
                    {isUploading ? "Uploading..." : "Change Photo"}
                  </button>
                  <p className="text-xs text-text-muted mt-1.5">JPG, PNG or GIF · Max 5MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-bg-white rounded-2xl border border-border-light p-6 shadow-sm animate-slide-up">
              <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
                <User size={16} className="text-accent-orange" /> Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Email (read-only)</label>
                <input type="email" value={user.email} disabled
                  className="w-full h-11 px-4 bg-gray-50 border border-border rounded-xl text-sm text-text-muted cursor-not-allowed" />
              </div>
            </div>

            {/* School / College Info */}
            <div className="bg-bg-white rounded-2xl border border-border-light p-6 shadow-sm animate-slide-up">
              <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
                <School size={16} className="text-accent-orange" /> School / College Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                    <span className="flex items-center gap-1"><School size={11} /> Institution Name</span>
                  </label>
                  <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                    <span className="flex items-center gap-1"><MapPin size={11} /> Address / City</span>
                  </label>
                  <input type="text" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="e.g. Bokaro Steel City, Jharkhand"
                    className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                    <span className="flex items-center gap-1"><FileText size={11} /> About / Profile</span>
                  </label>
                  <textarea value={schoolProfile} onChange={(e) => setSchoolProfile(e.target.value)}
                    placeholder="A brief description of your school or college..."
                    rows={3}
                    className="w-full p-4 bg-bg-primary border border-border rounded-xl text-sm resize-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-accent-red font-medium">{error}</div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pb-4">
              <button onClick={handleSave} disabled={isSaving}
                className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-70 ${saved ? "bg-accent-green text-white" : "bg-accent-orange hover:bg-orange-600 text-white shadow-orange-200"}`}>
                {isSaving ? (
                  <><Loader2 size={18} className="animate-spin" /> Saving...</>
                ) : saved ? (
                  <><Check size={18} /> Saved!</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </main>
        <MobileNavBar />
      </div>
    </div>
  );
}
