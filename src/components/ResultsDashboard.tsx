import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ResultsDashboardProps {
  analysis: CVAnalysis;
  onReset: () => void;
}

export const ResultsDashboard = ({ analysis, onReset }: ResultsDashboardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const sectionLabels = {
    professional_summary: "Professional Summary",
    work_experience: "Work Experience",
    skills: "Skills & Competencies",
    education: "Education",
    format: "Format & Presentation"
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-fade-in">
      {/* Overall Score Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-card to-secondary border-2 border-primary/20 shadow-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50" />
              <div className={`relative text-6xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                {analysis.overall_score}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">Your CV Score</h2>
              <p className="text-xl text-muted-foreground">{getScoreLabel(analysis.overall_score)}</p>
            </div>
          </div>
          <Button onClick={onReset} variant="outline" size="lg">
            <FileText className="mr-2 h-4 w-4" />
            Analyze Another CV
          </Button>
        </div>
      </Card>

      {/* Section Scores */}
      <Card className="p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Section Breakdown
        </h3>
        <div className="space-y-6">
          {Object.entries(analysis.section_scores).map(([key, score]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{sectionLabels[key as keyof typeof sectionLabels]}</span>
                <span className={`font-bold ${getScoreColor(score * 5)}`}>{score}/20</span>
              </div>
              <Progress value={score * 5} className="h-3" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            Strengths
          </h3>
          <ul className="space-y-4">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/90">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Improvements */}
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-accent">
            <AlertCircle className="h-6 w-6" />
            Areas to Improve
          </h3>
          <ul className="space-y-4">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground/90">{improvement}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ATS Tips */}
      <Card className="p-8 mt-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          ATS Optimization Tips
        </h3>
        <ul className="space-y-3">
          {analysis.ats_tips.map((tip, index) => (
            <li key={index} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
              </div>
              <span className="text-foreground/90">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
