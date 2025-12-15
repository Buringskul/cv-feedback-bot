import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { UploadZone } from "../components/UploadZone";

const toastMock = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

describe("UploadZone file size validation", () => {
  beforeEach(() => {
    toastMock.mockClear();
  });

  test("rejects files larger than 10MB and shows toast", async () => {
    const user = userEvent.setup();
    const onFileSelectMock = vi.fn();

    render(<UploadZone onFileSelect={onFileSelectMock} />);

    const fileInput = screen.getByTestId("file-input");

    const largeFile = new File(["dummy"], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });

    await user.upload(fileInput, largeFile);

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "File too large",
        description: "Maximum size is 10MB",
        variant: "destructive",
      })
    );

    expect(onFileSelectMock).not.toHaveBeenCalled();
  });
});
