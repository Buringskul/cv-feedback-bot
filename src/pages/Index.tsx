import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UploadZone } from "@/components/UploadZone";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

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

  // Later you can support different job roles
  const selectedRole = "General";

  const highlights = [
    {
      title: "ATS-focused feedback",
      desc: "Format and keyword checks to help you clear automated screens.",
    },
    {
      title: "Actionable suggestions",
      desc: "Specific rewrites for bullets, summaries, and impact statements.",
    },
    {
      title: "No account required",
      desc: "Upload, review, and download feedback without signing in.",
    },
  ];

  const steps = [
    {
      title: "Upload",
      desc: "Drag in your PDF or DOCX. We never share or train on your files.",
    },
    {
      title: "Analyze",
      desc: "Our AI reviews clarity, outcomes, ATS readiness, and formatting.",
    },
    {
      title: "Refine",
      desc: "Get a scorecard and next steps, then iterate or share with mentors.",
    },
  ];

  /* --------------------------------------------------------
     HANDLE FILE UPLOAD + SEND TO BACKEND
  --------------------------------------------------------- */
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
        body: formData, // send as multipart; no JSON body or custom headers needed
      });

      if (!res.ok) {
        console.log(await res.text());
        throw new Error("Failed to analyze CV");
      }

      const data = await res.json();
      if (!data) throw new Error("No analysis data received");

      setAnalysis(data);
      setShowUpload(false);

      toast({
        title: "Analysis complete!",
        description: "Your CV has been analyzed successfully",
      });

    } catch (error) {
      console.error("Analysis error:", error);

      toast({
        title: "Analysis failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to analyze CV. Please try again.",
        variant: "destructive",
      });

      setShowUpload(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* --------------------------------------------------------
     RESET + RUN ANOTHER ANALYSIS
  --------------------------------------------------------- */
  const handleReset = () => {
    setAnalysis(null);
    setShowUpload(true);
  };

  /* --------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Analyzing your CV...</h2>
          <p className="text-muted-foreground">Our AI is reviewing your resume</p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------
     SHOW RESULTS
  --------------------------------------------------------- */
  if (analysis) {
    return <ResultsDashboard analysis={analysis} onReset={handleReset} />;
  }

  /* --------------------------------------------------------
     HERO + UPLOAD ZONE
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen">
      <HeroSection onUploadClick={() => setShowUpload(true)} />

      {showUpload && (
        <div className="container mx-auto px-4 py-12 max-w-2xl animate-fade-in">
          <UploadZone onFileSelect={handleFileSelect} />
        </div>
      )}

      <section className="container mx-auto px-4 pb-10 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm p-4 flex flex-col gap-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 animate-fade-in">
        <div className="rounded-3xl border bg-gradient-to-br from-primary/5 via-accent/5 to-white shadow-md p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                How it works
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-1">
                Get from upload to actionable edits in minutes
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Keep using the free upload flow, or create an account to save
                reports across roles and versions.
              </p>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-primary hover:text-primary transition-colors"
            >
              Create free account
            </Link>
          </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm relative overflow-hidden"
            >
              <span className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                {idx + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Private by default - files are processed only for your session.</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full border bg-white text-xs font-medium">
                ATS heuristics + human-readable tips
              </span>
              <span className="px-3 py-1 rounded-full border bg-white text-xs font-medium">
                Works with PDFs and DOCX
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
