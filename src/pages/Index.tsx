import { useState } from "react";
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
  const { toast } = useToast();

  const selectedRole = "General";

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);

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

        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <div className="text-center space-y-4 bg-white/5 backdrop-blur-2xl 
            border border-white/10 px-12 py-14 rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.35)]">

            <Loader2 className="h-16 w-16 animate-spin text-[#34D399] mx-auto" />

            <h2 className="text-3xl font-semibold text-white">
              Analyzing your CV...
            </h2>

            <p className="text-lg text-white/70">
              Our AI is reviewing your resume and preparing insights.
            </p>
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