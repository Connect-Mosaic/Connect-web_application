import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminSettingsForm from "./AdminSettingsForm";

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => "test-jwt-token"),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AdminSettingsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSettings = {
    siteName: "Test Site",
    siteDescription: "Test Description",
    allowRegistration: true,
    defaultUserRole: "student",
    maxUploadSize: 5,
    maintenanceMode: false,
  };

  it("renders loading state initially", () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));
    render(<AdminSettingsForm />);
    expect(screen.getByText("Loading settings...")).toBeInTheDocument();
  });

  it("renders form with fetched settings", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByText("Admin Settings")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Site Name")).toHaveValue("Test Site");
    expect(screen.getByLabelText("Site Description")).toHaveValue(
      "Test Description"
    );
    expect(screen.getByLabelText("Allow New User Registration")).toBeChecked();
    expect(screen.getByLabelText("Default User Role")).toHaveValue("student");
    expect(screen.getByLabelText("Max Upload Size (MB)")).toHaveValue(5);
    expect(screen.getByLabelText("Maintenance Mode")).not.toBeChecked();
  });

  it("renders all form sections", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByText("General Settings")).toBeInTheDocument();
    });

    expect(screen.getByText("User Settings")).toBeInTheDocument();
    expect(screen.getByText("System Settings")).toBeInTheDocument();
  });

  it("handles form input changes", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Site Name")).toBeInTheDocument();
    });

    const siteNameInput = screen.getByLabelText("Site Name");
    fireEvent.change(siteNameInput, { target: { value: "New Site Name" } });
    expect(siteNameInput).toHaveValue("New Site Name");
  });

  it("handles checkbox changes", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(
        screen.getByLabelText("Allow New User Registration")
      ).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText("Allow New User Registration");
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("handles select changes", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Default User Role")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Default User Role");
    fireEvent.change(select, { target: { value: "organizer" } });
    expect(select).toHaveValue("organizer");
  });

  it("submits form and shows success message", async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockSettings }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ success: true, data: mockSettings }),
      });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByText("Save Settings")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(screen.getByText("Settings saved successfully!")).toBeInTheDocument();
    });
  });

  it("submits form and shows error message on failure", async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockSettings }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ success: false, message: "Server error" }),
      });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByText("Save Settings")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("disables save button while saving", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByText("Save Settings")).toBeInTheDocument();
    });

    // Mock a slow save request
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: () =>
                  Promise.resolve({ success: true, data: mockSettings }),
              }),
            100
          )
        )
    );

    fireEvent.click(screen.getByText("Save Settings"));

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.getByText("Saving...")).toBeDisabled();
  });

  it("renders role options correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSettings }),
    });

    render(<AdminSettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Default User Role")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Default User Role");
    expect(select).toContainHTML("<option value=\"student\">Student</option>");
    expect(select).toContainHTML("<option value=\"organizer\">Organizer</option>");
    expect(select).toContainHTML("<option value=\"business\">Business</option>");
  });
});
