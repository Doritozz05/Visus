import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service | Visus",
  description: "Terms of service for the Visus speed reading platform.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of service | Visus",
    description: "Read our terms for using the Visus platform and tools.",
    url: "https://visuslabs.tech/terms",
    siteName: "Visus",
    type: "website",
  },
};

export default function TermsOfService() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-background text-foreground selection:bg-primary/30 transition-all duration-300 main-layout-wrapper">
      <div className="max-w-3xl w-full space-y-8 liquid-glass p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden my-12">
        {/* Decorative backdrop elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="space-y-4 relative">
          <Link href="/" className="text-sm text-primary hover:underline transition-all">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight font-heading">
            Terms of <span className="text-gradient-primary">Service</span>
          </h1>
          <p className="text-muted-foreground">Last updated: June 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 relative text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mt-2">
              By accessing or using Visus (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">2. Description of Service</h2>
            <p className="text-muted-foreground mt-2">
              Visus is a speed-reading platform provided as a web application and PWA. We provide tools for Rapid Serial Visual Presentation (RSVP), visual clustering, and library management. We reserve the right to modify or discontinue the Service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">3. User Accounts</h2>
            <p className="text-muted-foreground mt-2">
              You are responsible for maintaining the confidentiality of your account credentials, including your Google account used for sign-in. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">4. Acceptable Use</h2>
            <p className="text-muted-foreground mt-2">
              You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service. Prohibited activities include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mt-2">
              <li>Attempting to gain unauthorized access to our systems.</li>
              <li>Uploading content that violates intellectual property rights.</li>
              <li>Using automated systems (bots) to scrape data from the Service.</li>
              <li>Violating Google&apos;s own Terms of Service while using our Google integration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">5. Intellectual Property</h2>
            <p className="text-muted-foreground mt-2">
              The Visus platform, including its code, design, and algorithms, is protected by intellectual property laws. While the project is open-source (check our LICENSE for details), the branding and specific implementations remain the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mt-2">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. VISUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">7. Changes to Terms</h2>
            <p className="text-muted-foreground mt-2">
              We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-heading text-foreground border-b border-border/40 pb-2">8. Governing Law</h2>
            <p className="text-muted-foreground mt-2">
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="pt-8 border-t border-border/20">
            <h3 className="text-lg font-bold mb-4">Explore Visus</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/speed-reading" className="text-primary hover:underline">Speed Reading Guide</Link>
              <Link href="/rsvp-method" className="text-primary hover:underline">RSVP Method</Link>
              <Link href="/epub-reader" className="text-primary hover:underline">EPUB Reader</Link>
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
