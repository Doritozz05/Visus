import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import * as React from "react";
import { AuthProvider, useAuth } from "../auth-context";
import { authService } from "@/core/config/services";

// Mock authService
vi.mock("@/core/config/services", () => ({
  authService: {
    getUser: vi.fn(),
    getAALStatus: vi.fn(),
    onAuthStateChange: vi.fn(() => vi.fn()),
    logout: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, isLoading, logout } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user">{user ? user.email : "no-user"}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should show user when authenticated", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    (authService.getUser as any).mockResolvedValue(mockUser);
    (authService.getAALStatus as any).mockResolvedValue({ currentLevel: "aal1" });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Loading...")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
    });
  });

  it("should show no-user when not authenticated", async () => {
    (authService.getUser as any).mockResolvedValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("no-user");
    });
  });

  it("should handle logout", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    (authService.getUser as any).mockResolvedValue(mockUser);
    (authService.getAALStatus as any).mockResolvedValue({ currentLevel: "aal1" });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutBtn = await screen.findByText("Logout");
    logoutBtn.click();

    expect(authService.logout).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("no-user");
    });
  });
});
