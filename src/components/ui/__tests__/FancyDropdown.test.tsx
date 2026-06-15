import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";
import { FancyDropdown } from "../FancyDropdown";

describe("FancyDropdown", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const options = [
    { value: "opt1", label: "Option 1", description: "Desc 1" },
    { value: "opt2", label: "Option 2", description: "Desc 2" },
  ];

  const defaultProps = {
    value: "opt1",
    onChange: vi.fn(),
    options,
    placeholder: "Select...",
    ariaLabel: "Dropdown",
  };

  it("renders with initial value", () => {
    render(<FancyDropdown {...defaultProps} />);
    expect(screen.getByText("Option 1")).toBeDefined();
  });

  it("opens menu on click", () => {
    render(<FancyDropdown {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Dropdown"));
    
    // We expect both the trigger and the menu option to be there.
    // Instead of queryByText, let's check for options in the listbox.
    expect(screen.getByRole("listbox")).toBeDefined();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("filters options when searchable", () => {
    render(<FancyDropdown {...defaultProps} searchable={true} keepSelectedVisibleWhenFiltered={false} />);
    fireEvent.click(screen.getByLabelText("Dropdown"));
    
    const input = screen.getByPlaceholderText("Search...");
    
    // Search for Option 2
    fireEvent.change(input, { target: { value: "Option 2" } });
    
    // Only 1 option should remain in the listbox
    const listbox = screen.getByRole("listbox");
    const visibleOptions = listbox.querySelectorAll('[role="option"]');
    expect(visibleOptions).toHaveLength(1);
    expect(visibleOptions[0].textContent).toContain("Option 2");
  });

  it("shows empty state when no results match", () => {
    render(<FancyDropdown {...defaultProps} searchable={true} keepSelectedVisibleWhenFiltered={false} />);
    fireEvent.click(screen.getByLabelText("Dropdown"));
    
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "non-existent" } });
    
    expect(screen.getByText("No results found")).toBeDefined();
  });
});
