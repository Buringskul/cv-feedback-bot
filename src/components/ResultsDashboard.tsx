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

const normalize = (score: number) => Math.min(100, Math.max(0, score * 5));

export const ResultsDashboard = ({ analysis, onReset }: ResultsDashboardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#34D399]"; // Green
    if (score >= 60) return "text-yellow-300";
    return "text-red-400";
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
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* TailorMyCV Branded Background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br 
        from-[#0F172A] via-[#1E293B] to-[#0F172A] animate-gradient-xy"
      />

      {/* Subtle Blobs */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[35rem] h-[35rem] bg-[#10B981]/20 rounded-full blur-[180px]" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[35rem] h-[35rem] bg-[#34D399]/20 rounded-full blur-[180px]" />

      <div className="container mx-auto px-4 py-24 max-w-6xl animate-fade-in text-white">

        {/* LOGO */}
        <div className="flex justify-center mb-10">
          <img
            src="/src/assets/logo.png"
            alt="TailorMyCV Logo"
            className="w-28 h-28 rounded-2xl shadow-xl"
          />
        </div>

        {/* OVERALL SCORE */}
        <Card className="p-12 mb-12 bg-white/10 border border-white/20 shadow-2xl rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">

            <div className="flex items-center gap-10">
              <div className="relative">
                <div className="absolute inset-0 bg-[#34D399] rounded-full blur-3xl opacity-30" />
                <div
                  className={`relative text-8xl font-extrabold ${getScoreColor(
                    analysis.overall_score
                  )}`}
                >
                  {analysis.overall_score}
                </div>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#34D399]">
                  Your CV Score
                </h2>
                <p className="text-xl mt-2 text-white/90">
                  {getScoreLabel(analysis.overall_score)}
                </p>
                <p className="text-white/70 mt-4 max-w-xl text-base leading-relaxed">
                  Your score reflects ATS compatibility, clarity, structure,
                  keyword richness, formatting, and overall hiring-signal quality.
                </p>
              </div>
            </div>

            <Button
              onClick={onReset}
              size="lg"
              className="px-10 py-5 text-lg rounded-xl bg-gradient-to-r 
              from-[#10B981] to-[#34D399] text-[#0F172A] shadow-lg
              hover:scale-[1.05] transition"
            >
              <FileText className="mr-2 h-6 w-6" />
              Analyze Another CV
            </Button>
          </div>
        </Card>

        {/* SECTION SCORES */}
        <Card className="p-12 mb-12 bg-white/10 border border-white/20 shadow-xl rounded-3xl backdrop-blur-xl">
          <h3 className="text-3xl font-semibold mb-10 flex items-center gap-3 text-white">
            <TrendingUp className="h-7 w-7 text-[#34D399]" />
            Section Breakdown
          </h3>

          <div className="space-y-8">
            {Object.entries(analysis.section_scores).map(([key, score]) => {
              const pct = normalize(score);
              return (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between text-xl">
                    <span className="text-xl font-medium text-white">
                    {sectionLabels[key as keyof typeof sectionLabels]}
                  </span>

                    <span className="font-semibold">{score}/20</span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-3 bg-white/20"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-12">

          {/* STRENGTHS */}
          <Card className="p-12 bg-white/10 border border-white/20 shadow-xl rounded-3xl backdrop-blur-xl">
            <h3 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-[#34D399]">
              <CheckCircle2 className="h-7 w-7" />
              Strengths
            </h3>

            <ul className="space-y-6 text-white/90 text-lg leading-relaxed">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-[#34D399] mt-1" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          {/* IMPROVEMENTS */}
          <Card className="p-12 bg-white/10 border border-white/20 shadow-xl rounded-3xl backdrop-blur-xl">
            <h3 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-red-300">
              <AlertCircle className="h-7 w-7" />
              Areas to Improve
            </h3>

            <ul className="space-y-6 text-white/90 text-lg leading-relaxed">
              {analysis.improvements.map((imp, i) => (
                <li key={i} className="flex gap-4">
                  <AlertCircle className="h-6 w-6 text-red-300 mt-1" />
                  {imp}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ATS Tips */}
        <Card className="p-12 mt-14 bg-white/10 border border-white/20 shadow-xl rounded-3xl backdrop-blur-xl">
          <h3 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-[#34D399]">
            <FileText className="h-7 w-7" />
            ATS Optimization Tips
          </h3>

          <ul className="space-y-8 text-white/90 text-lg leading-relaxed">
            {analysis.ats_tips.map((tip, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mt-1">
                  <span className="text-lg font-bold text-[#34D399]">{i + 1}</span>
                </div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
