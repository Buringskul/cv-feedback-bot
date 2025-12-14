import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">
          Loading results...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-xl w-full p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Analysis Complete</h2>
        <p className="text-muted-foreground">
          Your resume analysis results will appear here.
        </p>
      </Card>
    </div>
  );
}
