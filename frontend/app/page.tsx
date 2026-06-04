"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import MobileNavBar from "./components/layout/MobileNavBar";
import EmptyState from "./components/assignments/EmptyState";
import AssignmentCard from "./components/assignments/AssignmentCard";
import SearchBar from "./components/assignments/SearchBar";
import CreateButton from "./components/assignments/CreateButton";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { assignmentApi } from "@/lib/api";
import type { Assignment, ApiResponse, AssignmentListData } from "@/types";
import { Loader2 } from "lucide-react";

export default function AssignmentsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    assignments,
    isLoading,
    error,
    searchQuery,
    setAssignments,
    setLoading,
    setError,
    setSearchQuery,
    removeAssignment,
    setTotalPages,
  } = useAssignmentStore();

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = (await assignmentApi.list({
        search: searchQuery || undefined,
      })) as ApiResponse<AssignmentListData>;
      setAssignments(response.data.assignments);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      // If backend is not running, show empty state gracefully
      console.warn("Could not fetch assignments:", err);
      setAssignments([]);
      setError(null); // Don't show error for initial load
    } finally {
      setLoading(false);
    }
  }, [searchQuery, setAssignments, setLoading, setError, setTotalPages]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Handlers
  const handleView = (id: string) => {
    router.push(`/assignments/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await assignmentApi.delete(id);
      removeAssignment(id);
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  };

  const hasAssignments = assignments.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          title="Assignment"
          showBack={false}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center h-64">
              <Loader2
                size={32}
                className="text-accent-orange animate-spin"
              />
            </div>
          ) : !hasAssignments && !searchQuery ? (
            // Empty State
            <div className="flex items-center justify-center min-h-[calc(100vh-var(--topbar-height)-100px)]">
              <EmptyState />
            </div>
          ) : (
            // Filled State
            <div className="px-4 md:px-6 lg:px-8 py-6">
              {/* Page Header */}
              <div className="mb-6 animate-fade-in">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse-dot" />
                  <h1 className="text-xl font-bold text-text-primary">
                    Assignments
                  </h1>
                </div>
                <p className="text-sm text-text-secondary ml-5">
                  Manage and create assignments for your classes.
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="mb-6">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>

              {/* Error State */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-accent-red animate-fade-in">
                  {error}
                </div>
              )}

              {/* Assignment Grid */}
              {hasAssignments ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((assignment: Assignment, index: number) => (
                    <AssignmentCard
                      key={assignment._id}
                      assignment={assignment}
                      index={index}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                // No results for search
                <div className="text-center py-16 animate-fade-in">
                  <p className="text-text-muted text-sm">
                    No assignments found for &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Create Button — Desktop: bottom center bar, Mobile: FAB */}
        {(hasAssignments || searchQuery) && (
          <>
            <div className="hidden lg:block">
              <CreateButton variant="default" />
            </div>
            <CreateButton variant="fab" />
          </>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}
