"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import TopBar from "../../components/layout/TopBar";
import MobileNavBar from "../../components/layout/MobileNavBar";
import PaperViewer from "../../components/assignments/PaperViewer";
import { assignmentApi } from "@/lib/api";
import type { Assignment, GeneratedPaper } from "@/types";
import { Loader2, FileText, AlertTriangle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ViewAssignmentPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll for updates if still processing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchAssignment = async () => {
      try {
        const response: any = await assignmentApi.get(id);
        const data = response.data;
        setAssignment(data.assignment);
        setPaper(data.generatedPaper || null);

        // Auto-poll if status is pending or processing
        if (data.assignment.status === "pending" || data.assignment.status === "processing") {
          timeoutId = setTimeout(fetchAssignment, 3000); // Poll every 3 seconds
        }
      } catch (err: any) {
        setError(err.message || "Failed to load assignment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  const handleRegenerate = async () => {
    if (!confirm("Are you sure you want to regenerate this assignment? This will overwrite the current paper.")) return;
    
    setIsLoading(true);
    try {
      await assignmentApi.regenerate(id);
      // Wait a bit, then let the polling take over
      setTimeout(() => {
        setIsLoading(false);
        // Page effect will pick up the new "processing" status
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to regenerate");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title={assignment ? assignment.title : "Assignment"}
          showBack={true}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            
            {isLoading && !assignment ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 size={40} className="text-accent-orange animate-spin mb-4" />
                <p className="text-text-secondary font-medium">Loading assignment data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
                <AlertTriangle size={32} className="text-accent-red mx-auto mb-3" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Failed to load</h3>
                <p className="text-sm text-accent-red">{error}</p>
                <button 
                  onClick={() => router.push('/')}
                  className="mt-6 px-6 py-2 bg-bg-white border border-border-light rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : assignment ? (
              <>
                {/* Header Information */}
                <div className="mb-8 animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          assignment.status === 'completed' ? 'bg-accent-green' :
                          assignment.status === 'failed' ? 'bg-accent-red' : 'bg-accent-orange animate-pulse-dot'
                        }`} />
                        <h1 className="text-2xl font-bold text-text-primary">
                          {assignment.title}
                        </h1>
                      </div>
                      <div className="text-sm text-text-secondary ml-5 flex items-center gap-2">
                        <span className="capitalize px-2 py-0.5 bg-bg-white border border-border rounded text-xs font-semibold">
                          {assignment.status}
                        </span>
                        <span>•</span>
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>Class {assignment.className}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* State Views */}
                {assignment.status === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center animate-slide-up">
                    <AlertTriangle size={48} className="text-accent-red mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-text-primary mb-2">Generation Failed</h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
                      There was an error while generating this assignment using the AI. 
                      You can try regenerating it.
                    </p>
                    <button
                      onClick={handleRegenerate}
                      className="px-6 py-2.5 bg-accent-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      Retry Generation
                    </button>
                  </div>
                )}

                {(assignment.status === "pending" || assignment.status === "processing") && (
                  <div className="bg-bg-white border border-border-light rounded-2xl p-16 text-center animate-pulse">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                      <div className="absolute inset-0 border-4 border-accent-orange border-t-transparent rounded-full animate-spin" />
                      <Loader2 size={32} className="text-accent-orange animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">AI is working its magic...</h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                      Please wait while we analyze your requirements and construct the perfect question paper. 
                      This usually takes about 10-15 seconds.
                    </p>
                  </div>
                )}

                {assignment.status === "completed" && paper ? (
                  <div className="animate-slide-up">
                    <PaperViewer paper={paper} assignmentTitle={assignment.title} />
                    
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleRegenerate}
                        className="text-sm text-text-muted hover:text-accent-orange transition-colors underline underline-offset-4"
                      >
                        Not happy with the results? Regenerate paper
                      </button>
                    </div>
                  </div>
                ) : assignment.status === "completed" && !paper ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-10 text-center animate-slide-up">
                    <FileText size={48} className="text-accent-orange mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-text-primary mb-2">Paper Data Missing</h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                      The assignment is marked as completed but the paper data could not be loaded.
                    </p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </main>

        <MobileNavBar />
      </div>
    </div>
  );
}
