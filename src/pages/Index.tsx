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

      if (!res.ok) {
        console.log(await res.text());
        throw new Error("Failed to analyze CV");
      }

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

  const handleReset = () => {
    setAnalysis(null);
  };

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

  if (analysis) {
    return <ResultsDashboard analysis={analysis} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection onFileSelect={handleFileSelect} />
    </div>
  );
};

export default Index;