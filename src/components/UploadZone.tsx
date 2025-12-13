import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const VALID_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // PDF-only validation
  const validateFile = (file: File): boolean => {
    const validTypes = ["application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 shadow-glow scale-105"
          : "border-border hover:border-primary/50 hover:shadow-card"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      role="region"
      aria-labelledby="upload-zone-title"
    >
      <label
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center p-12 cursor-pointer"
      >
        <input
          id="resume-upload"
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileInput}
          aria-describedby="upload-zone-help"
        />

        <div className="relative mb-6" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 rounded-full blur-xl" />
          <div className="relative bg-secondary p-6 rounded-full">
            {isDragging ? (
              <FileText className="h-12 w-12 text-primary animate-bounce" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
        </div>

        <h3
          id="upload-zone-title"
          className="text-2xl font-semibold mb-2"
        >
          {isDragging ? "Drop your CV here" : "Upload Your CV"}
        </h3>

        <p
          id="upload-zone-help"
          className="text-muted-foreground mb-4 text-center"
        >
          Drag and drop or click to browse
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>Supports PDF and DOCX up to 10MB</span>
        </div>

        {selectedFile && (
          <p
            className="mt-4 text-sm text-primary font-medium"
            aria-live="polite"
          >
            Selected: {selectedFile.name}
          </p>
        )}
      </label>
    </Card>
  );
};
