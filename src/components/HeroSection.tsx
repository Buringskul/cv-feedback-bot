import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onUploadClick: () => void;
}

export const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary-glow/10" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Get Your CV Score in
            <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Seconds
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and receive instant AI-powered feedback with a comprehensive score and actionable improvements
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={onUploadClick}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Your CV
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
