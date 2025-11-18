import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UploadZone } from "@/components/UploadZone";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
        body: formData, // ⛔ no JSON, no headers → multer receives file correctly
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
    </div>
  );
};

export default Index;
