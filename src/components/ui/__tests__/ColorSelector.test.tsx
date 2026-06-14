import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { ColorSelector } from "../ColorSelector";

// Mock the settings hook
vi.mock("@/features/settings/context/settings-context", () => ({
  useSettings: () => ({
    settings: {
      general: {
        theme: "dark-violet",
        savedColors: [],
      },
    },
    updateGeneralSettings: vi.fn(),
  }),
}));

// Mock resolveColor and hexToHsl from color-utils
vi.mock("@/lib/color-utils", async () => {
  const actual = await vi.importActual("@/lib/color-utils") as any;
  return {
    ...actual,
    resolveColor: (c: string) => c.startsWith("#") ? c : "#8b5cf6",
    hexToHsl: (hex: string) => ({ h: 0, s: 100, l: 50, stringVal: "hsl(0, 100%, 50%)" }),
  };
});

describe("ColorSelector", () => {
  afterEach(() => {
    cleanup();
  });

  const getTrigger = (container: HTMLElement) => {
    // The main trigger button is the first button in the component container
    return container.querySelector("button") as HTMLButtonElement;
  };

  it("should auto-correct hex input missing '#' prefix", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ColorSelector value="#ff0000" onChange={onChange} />
    );

    // Open the dropdown
    fireEvent.click(getTrigger(container));

    // Find the hex input
    const input = screen.getByPlaceholderText("#HEXCODE") as HTMLInputElement;

    // Type "00ff00" without #
    fireEvent.change(input, { target: { value: "00ff00" } });

    // Expect input to have #00ff00
    expect(input.value).toBe("#00ff00");

    // Expect onChange to have been called with #00ff00
    expect(onChange).toHaveBeenCalledWith("#00ff00");
  });

  it("should handle valid hex with '#' prefix correctly", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ColorSelector value="#ff0000" onChange={onChange} />
    );

    fireEvent.click(getTrigger(container));

    const input = screen.getByPlaceholderText("#HEXCODE") as HTMLInputElement;

    // Type "#0000ff" with #
    fireEvent.change(input, { target: { value: "#0000ff" } });

    expect(input.value).toBe("#0000ff");
    expect(onChange).toHaveBeenCalledWith("#0000ff");
  });

  it("should not call onChange for invalid hex length", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ColorSelector value="#ff0000" onChange={onChange} />
    );

    fireEvent.click(getTrigger(container));

    const input = screen.getByPlaceholderText("#HEXCODE") as HTMLInputElement;

    // Type "12" (too short)
    fireEvent.change(input, { target: { value: "12" } });

    expect(input.value).toBe("#12");
    expect(onChange).not.toHaveBeenCalled();
  });
});
