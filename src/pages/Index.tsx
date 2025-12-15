import { useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navBar";

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const { toast } = useToast();

  const selectedRole = "General";
  const funFacts = [
    "Tip: Keep bullet points outcome-focused with numbers.",
    "Formatting: Use one font, consistent spacing, no photos.",
    "ATS: Avoid tables/headers/footers; keep keywords natural.",
    "Length: 1 page early career, 2 pages for senior roles.",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      setFactIndex(0);
      return;
    }
    setProgress(12);
    const prog = setInterval(
      () => setProgress((p) => Math.min(95, p + 7)),
      450
    );
    const facts = setInterval(
      () => setFactIndex((i) => (i + 1) % funFacts.length),
      2500
    );
    return () => {
      clearInterval(prog);
      clearInterval(facts);
    };
  }, [isAnalyzing, funFacts.length]);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(12);

    try {
      toast({
        title: "Analyzing your CV...",
        description: "This may take a few moments.",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", selectedRole);

      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze CV");

      const data = await res.json();
      if (!data) throw new Error("No analysis data received");

      setAnalysis(data);

      toast({
        title: "Analysis complete!",
        description: "Your CV has been analyzed successfully.",
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
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => setAnalysis(null);

  //---------------------------------------------------------
  // LOADING STATE
  //---------------------------------------------------------
  if (isAnalyzing) {
    return (
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <Navbar />

        {/* Navy + Green Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br 
          from-[#0F172A]/85 via-[#1E293B]/75 to-[#0F172A]/85 animate-gradient-xy" />

        {/* Blobs */}
        <div className="absolute top-[-6rem] left-[-6rem] w-[34rem] h-[34rem] 
          bg-[#10B981]/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-6rem] right-[-6rem] w-[34rem] h-[34rem] 
          bg-[#34D399]/20 rounded-full blur-[160px]" />

        <div className="flex-1 flex flex-col gap-10 items-center justify-center px-6 pt-20">
          <div className="text-center space-y-4 bg-white/5 backdrop-blur-2xl 
            border border-white/10 px-10 py-10 rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.35)] max-w-3xl w-full">

            <Loader2 className="h-16 w-16 animate-spin text-[#34D399] mx-auto" />

            <h2 className="text-3xl font-semibold text-white">
              Analyzing your CV...
            </h2>

            <p className="text-lg text-white/70">
              This usually takes ~20–40 seconds. Feel free to switch tabs.
            </p>

            <div className="w-full space-y-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-white/70">{funFacts[factIndex]}</p>
            </div>
          </div>

          <div className="w-full max-w-5xl grid gap-4 md:grid-cols-3 animate-pulse px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 h-32"
              >
                <div className="h-4 w-24 bg-white/20 rounded mb-3" />
                <div className="h-3 w-3/4 bg-white/15 rounded mb-2" />
                <div className="h-3 w-2/3 bg-white/15 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  //---------------------------------------------------------
  // RESULTS DASHBOARD
  //---------------------------------------------------------
  if (analysis) {
    return <ResultsDashboard analysis={analysis} onReset={handleReset} />;
  }

  //---------------------------------------------------------
  // DEFAULT HERO SECTION (Upload Page)
  //---------------------------------------------------------
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Navy + Green Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br 
        from-[#0F172A]/85 via-[#1E293B]/75 to-[#0F172A]/85 animate-gradient-xy" />

      {/* Blurred Green Blobs */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[34rem] h-[34rem] 
        bg-[#10B981]/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[34rem] h-[34rem] 
        bg-[#34D399]/20 rounded-full blur-[160px]" />

      <main className="flex-1 pt-20">
        <HeroSection onFileSelect={handleFileSelect} />
      </main>
    </div>
  );
};

export default Index;
