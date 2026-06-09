import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Visus",
  description: "Privacy Policy for Visus - Advanced Speed Reading Platform",
};

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-background text-foreground selection:bg-primary/30 transition-all duration-300">
      <div className="max-w-3xl w-full space-y-8 glass-panel p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden my-12">
        {/* Decorative backdrop elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="space-y-4 relative">
          <Link href="/" className="text-sm text-primary hover:underline transition-all">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight font-heading">
            Privacy <span className="text-gradient-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground">Last updated: June 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 relative text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">1. Introduction</h2>
            <p className="text-muted-foreground mt-2">
              Visus ("we", "our", or "us") is an advanced speed reading platform. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our web application and Progressive Web App (PWA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">2. Google OAuth & Limited Use</h2>
            <p className="text-muted-foreground mt-2">
              Visus allows you to sign in using your Google Account for seamless synchronization across devices.
            </p>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg my-4 italic text-foreground">
              Visus’s use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </div>
            <p className="text-muted-foreground">
              We do not sell your Google user data to third parties, nor do we use it for serving advertisements or for any purpose other than providing and improving the Visus reading experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">3. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mt-2">
              <li><strong>Personal Information:</strong> When you sign in with Google, we collect your email address and name to identify your account and sync your reading library.</li>
              <li><strong>Reading Progress:</strong> We store metadata about your books (titles, authors) and your reading progress (last word read, WPM settings, accuracy stats) to provide a consistent experience across devices.</li>
              <li><strong>Local Storage:</strong> Your uploaded books (ePUBs, PDFs, Text) are stored locally in your browser (IndexedDB) and are only synced to our secure cloud if you explicitly enable cloud backup.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">4. How We Use Your Information</h2>
            <p className="text-muted-foreground mt-2">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Manage your account and provide authentication.</li>
              <li>Synchronize your library and reading stats across multiple devices.</li>
              <li>Analyze platform performance and improve our RSVP and clustering algorithms.</li>
              <li>Communicate with you regarding support or critical platform updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">5. Data Retention & Deletion</h2>
            <p className="text-muted-foreground mt-2">
              We retain your information as long as your account is active. You may request the deletion of your account and all associated data at any time through the workspace settings or by contacting our support team. Upon request, all personal information and cloud-synced data will be permanently deleted from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">6. Security</h2>
            <p className="text-muted-foreground mt-2">
              We implement industry-standard security measures, including encryption and secure authentication protocols (OAuth 2.0), to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">7. Contact Us</h2>
            <p className="text-muted-foreground mt-2">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
              <br />
              <span className="text-foreground font-medium">support.visus@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
