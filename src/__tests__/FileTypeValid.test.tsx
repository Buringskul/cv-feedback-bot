import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { UploadZone } from "../components/UploadZone";

// Mock toast hook
const toastMock = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe("UploadZone file type validation", () => {
  test("rejects invalid file type and shows toast", () => {
    const onFileSelectMock = vi.fn();

    render(<UploadZone onFileSelect={onFileSelectMock} />);

    const fileInput = screen.getByTestId("file-input");

    const invalidFile = new File(["dummy"], "notes.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, {
      target: { files: [invalidFile] },
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      })
    );

    expect(onFileSelectMock).not.toHaveBeenCalled();
  });
});
