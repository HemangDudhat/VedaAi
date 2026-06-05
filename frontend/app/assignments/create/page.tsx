"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import TopBar from "../../components/layout/TopBar";
import MobileNavBar from "../../components/layout/MobileNavBar";
import StepIndicator from "../../components/create-form/StepIndicator";
import FileUpload from "../../components/create-form/FileUpload";
import AssignmentDetails from "../../components/create-form/AssignmentDetails";
import FormNavigation from "../../components/create-form/FormNavigation";
import { useCreateFormStore } from "@/store/useCreateFormStore";
import { assignmentApi } from "@/lib/api";
import { z } from "zod";

// Zod schema for form validation
const formSchema = z.object({
  title: z.string().min(1, "Assignment title is required"),
  subject: z.string().min(1, "Subject is required"),
  className: z.string().min(1, "Class/Grade is required"),
  schoolName: z.string().optional(),
  timeAllowed: z.string().min(1, "Time allowed is required"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(z.object({
    type: z.string(),
    label: z.string(),
    numberOfQuestions: z.number().min(1),
    marksPerQuestion: z.number().min(1),
  })).min(1, "At least one question type is required"),
});

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { 
    currentStep, 
    files,
    title,
    subject,
    className,
    schoolName,
    timeAllowed,
    dueDate,
    additionalInstructions,
    questionTypes,
    setIsSubmitting,
    setError,
    resetForm
  } = useCreateFormStore();

  const validateForm = () => {
    try {
      formSchema.parse({
        title,
        subject,
        className,
        schoolName,
        timeAllowed,
        dueDate,
        questionTypes,
      });
      setError(null);
      return true;
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError("Please fill all required fields correctly.");
      }
      return false;
    }
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      let uploadedFilesInfo = undefined;

      // 1. Upload Files if selected
      if (files && files.length > 0) {
        const uploadRes = await assignmentApi.uploadFiles(files);
        uploadedFilesInfo = uploadRes.data; // This is an array
      }

      // 2. Create Assignment (JSON payload)
      const payload = {
        title,
        subject,
        className,
        schoolName,
        timeAllowed,
        dueDate,
        additionalInstructions,
        questionTypes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...payload,
          uploadedFiles: uploadedFilesInfo,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to create assignment");
      }

      resetForm();
      router.push(`/assignments/${result.data._id}`);
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title="Assignment"
          showBack={true}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            {/* Page Header */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse-dot" />
                <h1 className="text-xl font-bold text-text-primary">
                  Create Assignment
                </h1>
              </div>
              <p className="text-sm text-text-secondary ml-5">
                Set up a new assignment for your students
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-bg-white rounded-2xl shadow-sm border border-border-light p-6 md:p-8">
              <StepIndicator currentStep={currentStep} />
              
              <div className="mt-8">
                {currentStep === 1 && <FileUpload />}
                {currentStep === 2 && <AssignmentDetails />}
              </div>

              <FormNavigation onSubmit={handleFormSubmit} />
            </div>
          </div>
        </main>

        <MobileNavBar />
      </div>
    </div>
  );
}
