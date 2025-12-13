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
    <div className="w-full flex justify-center px-4 sm:px-0">
      <div className="w-full max-w-md sm:max-w-lg">
        <Card
          className={`relative overflow-hidden transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 shadow-glow scale-[1.02]"
              : "border-border hover:border-primary/50 hover:shadow-card"
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center p-6 sm:p-12 cursor-pointer text-center">
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileInput}
            />

            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 rounded-full blur-xl" />
              <div className="relative bg-secondary p-4 sm:p-6 rounded-full">
                {isDragging ? (
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-bounce" />
                ) : (
                  <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                )}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              {isDragging ? "Drop your CV here" : "Upload Your CV"}
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span>Supports PDF up to 10MB</span>
            </div>
          </label>
        </Card>
      </div>
    </div>
  );
};
