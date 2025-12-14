import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { StepIndicator } from "@/components/StepIndicator";
import { UploadZone } from "@/components/UploadZone";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import AuthGate from "@/components/AuthGate";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";


interface CVAnalysis {
  overall_score: number;
  section_scores: {
    professional_summary: number;
    work_experience: number;
    skills: number;
    education: number;
    format: number;
  };
  strengths: string[];
  improvements: string[];
  ats_tips: string[];
}

const Index = () => {
  const [showUpload, setShowUpload] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const { toast } = useToast();

  // TEMP auth flag
  const isAuthenticated = false;
  const selectedRole = "General";

  /* ---------------- HANDLE FILE UPLOAD ---------------- */
  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);

    try {
      toast({
        title: "Analyzing your CV...",
        description: "This may take a few moments",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", selectedRole);

      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze CV");
      }

      const data = (await res.json()) as CVAnalysis;
      setAnalysis(data);
      setShowUpload(false);

      toast({
        title: "Analysis complete!",
        description: "Your CV has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setShowUpload(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setShowUpload(true);
  };

  /* ---------------- LOADING SCREEN ---------------- */
  if (isAnalyzing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Analyzing your CV…</h2>
          <p className="text-muted-foreground">
            Our AI is reviewing your resume
          </p>
        </div>
      </main>
    );
  }

  /* ---------------- RESULTS ---------------- */
  if (analysis && !isAuthenticated) return <AuthGate />;

  if (analysis && isAuthenticated) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-12">
        <StepIndicator currentStep="results" />
        <ResultsDashboard analysis={analysis} onReset={handleReset} />
      </main>
    );
  }

  /* ---------------- HOME PAGE ---------------- */
  return (
    <main className="min-h-screen relative">
      {/* Auth buttons */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <Link
          to="/signin"
          className="px-4 py-2 rounded-md border bg-background/80 backdrop-blur hover:bg-muted transition"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Register
        </Link>
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Step Indicator attached to Hero */}
      <div className="relative -mt-4 z-10 flex justify-center">
  <div className="rounded-full bg-background/90 backdrop-blur border shadow-sm px-8 py-3">
    <StepIndicator currentStep="upload" />
  </div>
</div>



      {/* Upload Section — REAL IMAGE BACKGROUND */}
      {showUpload && (
  <section className="relative py-24 overflow-hidden">
    {/* Background image */}
    <img
      src={heroBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-80"
      aria-hidden="true"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

    {/* Content */}
    <div className="relative container mx-auto px-4 max-w-2xl">
      <div className="rounded-3xl bg-background/90 border shadow-xl p-10">
        <UploadZone onFileSelect={handleFileSelect} />
      </div>
    </div>
  </section>
)}
    </main>
  );
};

export default Index;
