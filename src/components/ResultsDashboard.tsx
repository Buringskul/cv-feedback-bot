import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ResultsDashboardProps {
  analysis: CVAnalysis;
  onReset: () => void;
}

// Convert numeric values (0–20) → % (0–100)
const normalize = (score: number) => Math.min(100, Math.max(0, score * 5));

export const ResultsDashboard = ({ analysis, onReset }: ResultsDashboardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
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
    skills: "Skills",
    education: "Education",
    format: "Format & Presentation",
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-fade-in">

      {/* OVERALL SCORE */}
      <Card className="p-8 mb-10 bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20 shadow-lg rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {/* Glowing Score Bubble */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl opacity-40" />
              <div
                className={`relative text-7xl font-extrabold drop-shadow ${getScoreColor(
                  analysis.overall_score
                )}`}
              >
                {analysis.overall_score}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold">Your CV Score</h2>
              <p className="text-lg mt-1 text-muted-foreground">
                {getScoreLabel(analysis.overall_score)}
              </p>
            </div>
          </div>

          <Button onClick={onReset} variant="outline" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Analyze Another CV
          </Button>
        </div>
      </Card>

      {/* SECTION SCORES */}
      <Card className="p-8 mb-10 shadow-md rounded-2xl">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Section Breakdown
        </h3>

        <div className="space-y-7">
          {Object.entries(analysis.section_scores).map(([key, score]) => {
            const scorePct = normalize(score);
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">
                    {sectionLabels[key as keyof typeof sectionLabels]}
                  </span>
                  <span className={`text-lg font-semibold ${getScoreColor(scorePct)}`}>
                    {score}/20
                  </span>
                </div>

                <Progress value={scorePct} className="h-3" />
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-10">

        {/* STRENGTHS */}
        <Card className="p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            Strengths
          </h3>

          <ul className="space-y-5">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* IMPROVEMENTS */}
        <Card className="p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-red-500">
            <AlertCircle className="h-6 w-6" />
            Areas to Improve
          </h3>

          <ul className="space-y-5">
            {analysis.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-1" />
                <span className="text-foreground">{imp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ATS TIPS */}
      <Card className="p-8 mt-10 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 shadow-md">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          ATS Optimization Tips
        </h3>

        <ul className="space-y-4">
          {analysis.ats_tips.map((tip, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-sm font-bold text-primary">{i + 1}</span>
              </div>
              <span className="text-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
