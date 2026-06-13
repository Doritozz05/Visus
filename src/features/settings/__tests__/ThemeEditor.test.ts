import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeEditor } from "../components/ThemeEditor";

// Mock the FancyDropdown to simplify rendering
vi.mock("@/components/ui/FancyDropdown", () => ({
  FancyDropdown: ({ value, onChange, options }: any) =>
    React.createElement(
      "select",
      {
        "data-testid": "fancy-dropdown-mock",
        value,
        onChange: (e: any) => onChange(e.target.value),
      },
      options.map((opt: any) =>
        React.createElement(
          "option",
          { key: opt.value, value: opt.value },
          opt.label
        )
      )
    ),
}));

describe("ThemeEditor Component", () => {
  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnClose = vi.fn();

  const mockTheme = {
    id: "theme-custom-123",
    name: "Aesthetic Crimson",
    isDark: true,
    background: "#120202",
    foreground: "#ffd3d3",
    border: "#441111",
    cardBackground: "#220505",
    cardForeground: "#ffd3d3",
    cardBorder: "#441111",
    accent: "#ff0033",
    accentForeground: "#ffffff",
    muted: "#1a0303",
    mutedForeground: "#995555",
    cardRadius: "16px",
    cardShadow: "glow",
    overrideSidebar: false,
    overrideReader: false,
    bgType: "solid" as const,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should render the theme editor title and initial tab elements", () => {
    render(
      React.createElement(ThemeEditor, {
        themeToEdit: mockTheme,
        onSave: mockOnSave,
        onDelete: mockOnDelete,
        onClose: mockOnClose,
      })
    );

    // Verify Title and name input
    expect(screen.getByText("Theme Designer")).toBeTruthy();
    const nameInput = screen.getByPlaceholderText("Theme name...") as HTMLInputElement;
    expect(nameInput.value).toBe("Aesthetic Crimson");

    // Verify save button and cancel button are rendered
    expect(screen.getAllByText("Save & Apply Theme").length).toBeGreaterThan(0);
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("should allow changing the theme name", () => {
    render(
      React.createElement(ThemeEditor, {
        themeToEdit: mockTheme,
        onSave: mockOnSave,
        onDelete: mockOnDelete,
        onClose: mockOnClose,
      })
    );

    const nameInput = screen.getByPlaceholderText("Theme name...") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "New Theme Name" } });
    expect(nameInput.value).toBe("New Theme Name");
  });

  it("should support tab switching", () => {
    render(
      React.createElement(ThemeEditor, {
        themeToEdit: mockTheme,
        onSave: mockOnSave,
        onDelete: mockOnDelete,
        onClose: mockOnClose,
      })
    );

    // Initial state: colors tab is active. Let's look for "Base color model" text
    expect(screen.getByText("Base color model")).toBeTruthy();

    // Find and click the components tab (Decoupled sections)
    // On desktop / wide view, it has "Decoupled sections" label
    const componentTabBtn = screen.getByText("Decoupled sections");
    fireEvent.click(componentTabBtn);

    // Now components tab is active. We should find Sidebar override controls
    expect(screen.getByText("Decoupled Sidebar Styles")).toBeTruthy();
  });

  it("should call onSave with correct theme state when clicking save", () => {
    render(
      React.createElement(ThemeEditor, {
        themeToEdit: mockTheme,
        onSave: mockOnSave,
        onDelete: mockOnDelete,
        onClose: mockOnClose,
      })
    );

    const saveBtn = screen.getAllByText("Save & Apply Theme")[0];
    fireEvent.click(saveBtn);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "theme-custom-123",
        name: "Aesthetic Crimson",
        isDark: true,
      })
    );
  });
});
