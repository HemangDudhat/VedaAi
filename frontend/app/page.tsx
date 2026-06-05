"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sparkles,
  FileText,
  Download,
  Upload,
  ChevronRight,
  Check,
  Star,
  Zap,
  BookOpen,
  Users,
  Library,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Question Generation",
    desc: "Generate tailored, curriculum-aligned questions in seconds using Google Gemini AI.",
    color: "bg-orange-50 text-accent-orange",
  },
  {
    icon: Download,
    title: "Dual PDF Export",
    desc: "Download question papers with or without answer keys — perfect for both students and teachers.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Upload,
    title: "Reference Material Upload",
    desc: "Upload your own PDF, notes, or textbook pages and the AI generates questions strictly from your content.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "10+ Question Types",
    desc: "MCQ, Short Answer, Long Answer, True/False, Fill in the Blanks, Numerical, Diagram-based and more.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Library,
    title: "Intelligent Document Hub",
    desc: "Upload your textbooks and syllabus once to your personal library, and instantly reuse them across multiple assignments without re-uploading.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Zap,
    title: "Instant Regeneration",
    desc: "Not satisfied? Regenerate questions with a single click while keeping all your paper settings intact.",
    color: "bg-yellow-50 text-yellow-600",
  },
  // {
  //   icon: Users,
  //   title: "School Profile",
  //   desc: "Set up your school name, address and branding — automatically included in every generated paper header.",
  //   color: "bg-pink-50 text-pink-600",
  // },
];

const steps = [
  { step: "01", title: "Fill in the Details", desc: "Enter your assignment title, subject, class, school name, time allowed and choose your question types." },
  { step: "02", title: "Upload Reference (Optional)", desc: "Upload a PDF or document — the AI will base all questions strictly on your uploaded material." },
  { step: "03", title: "Download Your Paper", desc: "Your polished, exam-ready question paper is generated in seconds. Download with or without answers." },
];

const stats = [
  { value: "10+", label: "Question Types" },
  { value: "< 30s", label: "Generation Time" },
  { value: "2", label: "PDF Export Modes" },
  { value: "∞", label: "Papers to Create" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Physics Teacher, DPS", text: "VedaAI saved me hours every week. I upload my chapter notes and get a full question paper in seconds. Absolutely brilliant!", rating: 5 },
  { name: "Rahul Mehta", role: "Mathematics HOD, Kendriya Vidyalaya", text: "The quality of questions is surprisingly high. The AI understands context perfectly and even generates numerical problems correctly.", rating: 5 },
  { name: "Ananya Gupta", role: "Biology Teacher, St. Mary's", text: "Being able to download without answer keys for students and with answer keys for myself is a game-changer!", rating: 5 },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && user) {
      router.replace("/dashboard");
    }
  }, [isInitialized, user, router]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* ── NAV ────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">VedaAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 px-5 py-2.5 rounded-xl transition-colors shadow-sm">
              Get Started Free <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-orange-200">
                <Sparkles size={13} />
                Powered by Google Gemini AI
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                Generate Perfect<br />
                <span className="text-[#f97316]">Question Papers</span><br />
                in Seconds
              </h1>
              <p className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed">
                AI-powered question paper creation for teachers. Upload your reference material, set your preferences, and get a print-ready exam paper instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/auth/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
                  Start Creating for Free
                  <ChevronRight size={18} />
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-base transition-all">
                  Already have an account?
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-400">
                {["No credit card required", "Free to start", "Instant results"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-green-500" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden p-4">
                  <Image
                    src="/hero-illustration.png"
                    alt="VedaAI Question Paper Generation"
                    width={600}
                    height={450}
                    className="w-full h-auto rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <section className="bg-[#2d2d2d] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl lg:text-4xl font-extrabold text-[#f97316]">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">A complete toolkit for modern teachers to create professional assessments in minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500">Three simple steps to your perfect question paper.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-200 relative z-10">
                    <span className="text-white font-extrabold text-lg">{s.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Loved by Teachers</h2>
            <p className="text-lg text-gray-500">Educators across India are saving time with VedaAI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-orange-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section className="py-24 bg-[#2d2d2d]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-orange-500/30">
            <Sparkles size={13} />
            Free to get started
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Ready to transform how you<br />create question papers?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">Join thousands of teachers already using VedaAI. No setup needed.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-orange-500 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-900/30 hover:-translate-y-0.5">
            Create Your First Paper — Free
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="bg-[#1a1a1a] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2d2d2d] rounded-lg flex items-center justify-center border border-gray-700">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-gray-400 text-sm font-semibold">VedaAI</span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            © {new Date().getFullYear()} VedaAI. All rights reserved. Built for teachers, powered by AI.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <Link href="/auth/login" className="hover:text-gray-400 transition-colors">Login</Link>
            <Link href="/auth/signup" className="hover:text-gray-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
