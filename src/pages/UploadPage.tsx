import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Simulated analysis delay (UI-only)
      setTimeout(() => {
        setLoading(false);
        navigate("/results");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <UploadZone onFileSelect={setFile} />

      {/* Empty state */}
      {!file && !loading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Upload a PDF resume to begin analysis.
        </p>
      )}

      {/* Error state */}
      {error && (
        <p className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Loading state */}
      <Button
        className="mt-6 w-full max-w-md"
        disabled={!file || loading}
        onClick={handleAnalyze}
      >
        {loading ? "Analyzing resume..." : "Analyze Resume"}
      </Button>
    </div>
  );
}
