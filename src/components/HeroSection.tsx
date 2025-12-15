// src/components/HeroSection.tsx
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import heroImage from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onFileSelect: (file: File) => void;
  isAuthed?: boolean;
}

export const HeroSection = ({ onFileSelect, isAuthed }: HeroSectionProps) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadClick = () => setShowUpload(true);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pb-20 pt-16 md:px-6">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Navy + Green gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F172A]/70 via-[#1E293B]/60 to-[#0F172A]/70" />

      {/* Card Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl bg-white/5 p-10 md:p-14 backdrop-blur-2xl border border-white/10 shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
        {/* Heading Section */}
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Get Your CV Score in
            <span className="block mt-1 bg-gradient-to-r from-[#10B981] to-[#34D399] text-transparent bg-clip-text">
              Seconds
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/80">
            Upload your resume and receive instant AI-powered insights, a comprehensive score, and actionable improvements - all within seconds.
          </p>

          {/* Upload Button */}
          <div className="mt-4 flex flex-col items-center justify-center sm:flex-row sm:gap-6">
            <Button
              size="lg"
              onClick={handleUploadClick}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r
                from-[#10B981] to-[#34D399]
                px-10 py-6 text-lg font-semibold text-[#0F172A]
                shadow-lg shadow-[#10B981]/30 transition hover:scale-[1.04]"
            >
              <Upload className="h-5 w-5" />
              Upload Your CV
            </Button>
          </div>

          {!isAuthed && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-white/80">
              <Link to="/signin" className="underline underline-offset-4 hover:text-white">
                Sign in
              </Link>
              <span className="hidden sm:block">•</span>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Create account
              </Link>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        {showUpload && (
          <div className="mx-auto w-full max-w-3xl pt-6">
            <UploadZone onFileSelect={onFileSelect} />
          </div>
        )}

        {/* Tags */}
        <div className="pt-4 flex flex-wrap justify-center gap-4 text-sm font-medium text-white/70">
          <span className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-xl border border-white/10">
            AI-Powered Analysis
          </span>
          <span className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-xl border border-white/10">
            Instant Results
          </span>
          <span className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-xl border border-white/10">
            100% Secure
          </span>
        </div>
      </div>
    </section>
  );
};
