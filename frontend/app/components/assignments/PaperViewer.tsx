"use client";

import { useRef, useState } from "react";
import { Download, CheckCircle2, AlertCircle } from "lucide-react";
import type { GeneratedPaper } from "@/types";

interface PaperViewerProps {
  paper: GeneratedPaper;
  assignmentTitle: string;
}

export default function PaperViewer({ paper, assignmentTitle }: PaperViewerProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleExportPDF = async (includeAnswers: boolean) => {
    if (!paperRef.current) return;
    setIsExporting(true);
    
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = paperRef.current;
      const opt: any = {
        margin: [10, 10], // top, left
        filename: `${assignmentTitle.replace(/\s+/g, '_')}_QuestionPaper.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          onclone: (clonedDoc: Document) => {
            // Remove style rules containing oklch( or lab( to prevent html2canvas parsing errors
            Array.from(clonedDoc.styleSheets).forEach((sheet) => {
              try {
                for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                  const rule = sheet.cssRules[i];
                  const cssText = rule.cssText || "";
                  if (cssText.includes("oklch(") || cssText.includes("lab(")) {
                    sheet.deleteRule(i);
                  }
                }
              } catch (err) {
                // Ignore cross-origin sheets or non-standard sheets
              }
            });
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Temporarily set answers state based on export choice
      const previousShowAnswers = showAnswers;
      if (includeAnswers !== showAnswers) {
        setShowAnswers(includeAnswers);
        // small timeout to let react re-render
        await new Promise((resolve) => setTimeout(resolve, 100)); 
      }

      await html2pdf().set(opt).from(element).save();

      if (includeAnswers !== previousShowAnswers) {
        setShowAnswers(previousShowAnswers);
      }
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-700 border-green-200";
      case "moderate":
      case "medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-white p-4 rounded-2xl shadow-sm border border-border-light">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${showAnswers 
                ? 'bg-bg-dark text-text-white' 
                : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              }
            `}
          >
            {showAnswers ? "Hide Answer Key" : "Show Answer Key"}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isExporting ? (
            <div className="flex items-center gap-2 px-6 py-2 bg-accent-orange text-white text-sm font-bold rounded-xl opacity-70 cursor-not-allowed w-full justify-center">
              <span className="animate-pulse">Generating PDF...</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleExportPDF(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-white border border-border-light text-text-primary text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <Download size={18} />
                Without Answers
              </button>
              <button
                onClick={() => handleExportPDF(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors w-full sm:w-auto"
              >
                <Download size={18} />
                With Answers
              </button>
            </>
          )}
        </div>
      </div>

      {/* Printable Paper Area */}
      <div 
        ref={paperRef}
        className="bg-white p-8 md:p-12 shadow-[var(--shadow-card)] border border-border-light rounded-2xl"
        style={{ fontFamily: "Arial, sans-serif", color: "#111" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">
            {paper.header.schoolName}
          </h1>
          <h2 className="text-lg font-semibold mb-4">
            Subject: {paper.header.subject} | Class: {paper.header.className}
          </h2>
          <div className="flex justify-between items-center text-sm font-medium mb-4">
            <span>Time Allowed: {paper.header.timeAllowed}</span>
            <span>Maximum Marks: {paper.header.maximumMarks}</span>
          </div>

          {/* Student Details Fields */}
          <div className="flex justify-between items-end border-b border-gray-400 pb-2 mb-4 text-sm font-medium pt-2 text-gray-800">
            <span className="flex-1 text-left">Name: ______________________</span>
            <span className="flex-1 text-center">Roll No.: ______________</span>
            <span className="flex-1 text-right">Section: ___________</span>
          </div>
          {paper.header.generalInstructions && (
            <div className="mt-4 text-left p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="font-bold block mb-1">General Instructions:</span>
              <p className="text-sm">{paper.header.generalInstructions}</p>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {paper.sections.map((section: any, idx: number) => (
            <div key={idx} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold uppercase">{section.title}</h3>
                {section.instructions && (
                  <p className="text-sm italic mt-1">{section.instructions}</p>
                )}
              </div>

              <div className="space-y-8">
                {section.questions.map((q: any) => (
                  <div key={q.questionNumber} className="relative group">
                    <div className="flex items-start gap-3">
                      <span className="font-bold min-w-[24px]">Q{q.questionNumber}.</span>
                      <div className="flex-1">
                        <p className="text-base font-medium mb-3 leading-relaxed">{q.text}</p>
                        
                        {/* Options for MCQ */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 ml-2">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs font-medium">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Marks */}
                      <div className="font-bold shrink-0">
                        [{q.marks}]
                      </div>
                    </div>

                    {/* Metadata Badges (Difficulty) - Only shown in screen UI, often hidden in real print but kept for now */}
                    <div className="ml-9 flex items-center gap-2 mt-2" data-html2canvas-ignore="true">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Answer Key Toggle */}
                    {showAnswers && q.answer && (
                      <div className="ml-9 mt-4 p-3 rounded-lg text-sm animate-slide-up" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: '1px', color: '#14532d' }}>
                        <span className="font-bold flex items-center gap-1 mb-1" style={{ color: '#15803d' }}>
                          <CheckCircle2 size={14} /> Answer Key:
                        </span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          Generated using VedaAI ✨
        </div>
      </div>
    </div>
  );
}
