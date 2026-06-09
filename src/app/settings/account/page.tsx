import { Metadata } from "next";
import { AccountSettingsClient } from "./AccountSettingsClient";

export const metadata: Metadata = {
  title: "Account Settings | Visus",
  description: "Manage your credentials and protect your library with MFA.",
};

export default function AccountSettingsPage() {
  return <AccountSettingsClient />;
}
