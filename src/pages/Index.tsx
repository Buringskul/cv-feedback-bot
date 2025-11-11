import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UploadZone } from "@/components/UploadZone";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const [showUpload, setShowUpload] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      // For PDF, we'll use a simple text extraction
      // In production, you'd want a more robust PDF parser
      const text = await file.text();
      return text;
    } else {
      // For DOCX, read as text (simplified)
      const text = await file.text();
      return text;
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setShowUpload(false);

    try {
      toast({
        title: "Analyzing your CV...",
        description: "This may take a few moments",
      });

      const cvText = await extractTextFromFile(file);

      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: { cvText }
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No analysis data received');
      }

      setAnalysis(data);
      toast({
        title: "Analysis complete!",
        description: "Your CV has been analyzed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze CV. Please try again.",
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

  if (analysis) {
    return <ResultsDashboard analysis={analysis} onReset={handleReset} />;
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Analyzing your CV...</h2>
          <p className="text-muted-foreground">Our AI is reviewing your resume</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-500/10">
      <HeroSection onUploadClick={() => setShowUpload(true)} />
      
      {showUpload && (
        <div className="container mx-auto px-4 py-24 max-w-2xl animate-fade-in">
          <UploadZone onFileSelect={handleFileSelect} />
        </div>
      )}
    </div>
  );
};

export default Index;