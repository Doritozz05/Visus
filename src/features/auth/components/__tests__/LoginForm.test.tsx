import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import * as React from "react";
import { LoginForm } from "../LoginForm";
import { authService } from "@/core/config/services";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock authService
vi.mock("@/core/config/services", () => ({
  authService: {
    signInWithPassword: vi.fn(),
    getAALStatus: vi.fn(),
    getSession: vi.fn(),
    verifyMFA: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders login fields", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("you@email.com")).toBeDefined();
    expect(screen.getByPlaceholderText("••••••••")).toBeDefined();
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeDefined();
  });

  it("shows error if fields are empty", async () => {
    const { toast } = await import("sonner");
    render(<LoginForm />);
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));
    
    expect(toast.error).toHaveBeenCalledWith("Required fields", expect.anything());
    expect(authService.signInWithPassword).not.toHaveBeenCalled();
  });

  it("calls signInWithPassword and redirects on success", async () => {
    (authService.signInWithPassword as any).mockResolvedValue({});
    (authService.getAALStatus as any).mockResolvedValue({ currentLevel: "aal1", factorId: null });
    
    // Mock window.location
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: "" } as any;

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText("you@email.com"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(authService.signInWithPassword).toHaveBeenCalledWith("test@example.com", "password123");
      expect(window.location.href).toBe("/library");
    });

    (window as any).location = originalLocation;
  });

  it("shows MFA UI if session requires it", async () => {
    (authService.signInWithPassword as any).mockResolvedValue({});
    (authService.getAALStatus as any).mockResolvedValue({ currentLevel: "aal1", factorId: "factor-123" });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText("you@email.com"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    expect(await screen.findByText("Two-Step Verification")).toBeDefined();
    expect(screen.getByPlaceholderText("000000")).toBeDefined();
  });
});
