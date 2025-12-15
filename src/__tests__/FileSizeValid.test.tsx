import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { UploadZone } from "../components/UploadZone";

const toastMock = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe("UploadZone file validation", () => {
  test("rejects files larger than 10MB and shows toast", () => {
    render(<UploadZone onFileSelect={vi.fn()} />);

    const fileInput = screen.getByTestId("file-input");

    const largeFile = new File(["dummy"], "big.pdf", {
      type: "application/pdf",
    });

    Object.defineProperty(largeFile, "size", {
      value: 11 * 1024 * 1024,
    });

    fireEvent.change(fileInput, {
      target: { files: [largeFile] },
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      })
    );
  });
});
