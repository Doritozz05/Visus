import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Delete item",
    description: "Are you sure?",
  };

  it("renders correctly when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Delete item")).toBeDefined();
    expect(screen.getByText("Are you sure?")).toBeDefined();
    expect(screen.getByText("Confirm")).toBeDefined();
    expect(screen.getByText("Cancel")).toBeDefined();
  });

  it("does not render when closed", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Delete item")).toBeNull();
  });

  it("calls onClose when cancel is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when confirm is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled(); 
  });

  it("shows loading state", () => {
    render(<ConfirmDialog {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Processing...")).toBeDefined();
    
    const confirmBtn = screen.getByText("Processing...") as HTMLButtonElement;
    const cancelBtn = screen.getByText("Cancel") as HTMLButtonElement;
    
    expect(confirmBtn.disabled).toBe(true);
    expect(cancelBtn.disabled).toBe(true);
  });

  it("closes on Escape key", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
