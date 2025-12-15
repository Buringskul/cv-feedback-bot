import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const VALID_TYPES = ["application/pdf"];
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

  const validateFile = (file: File): boolean => {
    if (!VALID_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum size is 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  return (
    <Card
      className={`
        relative overflow-hidden rounded-2xl border 
        transition-all duration-300 cursor-pointer
        backdrop-blur-xl bg-white/19 border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.45)]
        ${isDragging ? "scale-[1.03] border-[#34D399]" : "hover:border-white/20"}
      `}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label className="flex flex-col items-center justify-center p-12 w-full h-full cursor-pointer">

        {/* Hidden input */}
        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileInput}
        />

        {/* Icon Glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-20 rounded-full blur-xl" />
          <div className="relative bg-[#0F172A] p-6 rounded-full border border-white/10 shadow-inner">
            {isDragging ? (
              <FileText className="h-12 w-12 text-[#34D399] animate-bounce" />
            ) : (
              <Upload className="h-12 w-12 text-[#34D399]" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white mb-2">
          {isDragging ? "Drop your CV here" : "Upload Your CV"}
        </h3>

        <p className="text-white/70 text-center mb-4">
          Drag and drop your file or click to browse.
        </p>

        {/* Info Chip */}
        <div className="flex items-center gap-2 text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl">
          <AlertCircle className="h-4 w-4 text-[#34D399]" />
          <span>PDF only - Max 10MB</span>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <>
            <p className="mt-4 text-sm text-[#34D399] font-medium">
              Selected: {selectedFile.name}
            </p>

            <button
              className="
                mt-5 px-8 py-3 rounded-lg text-lg font-semibold
                bg-gradient-to-r from-[#10B981] to-[#34D399]
                text-[#0F172A]
                hover:scale-[1.03] transition-all shadow-lg shadow-[#10B981]/30
              "
              onClick={() => selectedFile && onFileSelect(selectedFile)}
            >
              Analyze CV
            </button>
          </>
        )}
      </label>
    </Card>
  );
};
