import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">LumenFrame</h1>
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy First
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Privacy
            <span className="text-primary"> Policy</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Your privacy is fundamental to everything we do. Learn how we
            protect your data and respect your rights.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Privacy Commitments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe privacy is a fundamental right, not a luxury
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border text-center">
              <CardHeader>
                <Eye className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Transparency</CardTitle>
                <CardDescription>
                  We clearly explain what data we collect, why we collect it,
                  and how we use it. No hidden practices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Your data is encrypted in transit and at rest. We use
                  industry-standard security measures to protect your
                  information.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Control</CardTitle>
                <CardDescription>
                  You have full control over your data. Access, modify, or
                  delete your information at any time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Information</h4>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your email address
                    and encrypted password. We do not collect or store any other
                    personal information unless you voluntarily provide it.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Images and Content</h4>
                  <p className="text-muted-foreground">
                    We temporarily process the images you upload for editing
                    purposes. Images are automatically deleted from our servers
                    after processing is complete, typically within 24 hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-muted-foreground">
                    We collect anonymous usage statistics to improve our
                    service, including feature usage patterns and performance
                    metrics. This data cannot be linked back to individual
                    users.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Provision</h4>
                  <p className="text-muted-foreground">
                    We use your information solely to provide and improve our AI
                    photo editing services. Your images are processed by our AI
                    models to generate the requested edits.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Communication</h4>
                  <p className="text-muted-foreground">
                    We may send you important service updates, security
                    notifications, or respond to your support requests using
                    your email address.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Research and Development
                  </h4>
                  <p className="text-muted-foreground">
                    Anonymous usage data helps us improve our AI models and
                    develop new features. No personal information or image
                    content is used for this purpose.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Data Security and Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Encryption</h4>
                  <p className="text-muted-foreground">
                    All data is encrypted in transit using TLS 1.3 and at rest
                    using AES-256 encryption. Your passwords are hashed using
                    industry-standard algorithms.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <p className="text-muted-foreground">
                    Account information is retained until you delete your
                    account. Uploaded images are automatically deleted within 24
                    hours of processing. Edit history and metadata are retained
                    for 30 days for quality assurance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Third-Party Services</h4>
                  <p className="text-muted-foreground">
                    We use trusted third-party services for authentication
                    (Supabase) and AI processing (Google Gemini). These services
                    are bound by strict data processing agreements and privacy
                    standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Access and Control</h4>
                  <p className="text-muted-foreground">
                    You can access, modify, or delete your account information
                    at any time through your account settings. You can also
                    request a copy of all data we have about you.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Portability</h4>
                  <p className="text-muted-foreground">
                    You can export your edit history and account data in a
                    machine-readable format at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Deletion</h4>
                  <p className="text-muted-foreground">
                    You can delete your account and all associated data at any
                    time. This action is irreversible and will permanently
                    remove all your information from our systems.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> privacy@lumenframe.ai
                  </p>
                  <p className="text-sm">
                    <strong>Support:</strong>{" "}
                    <Link
                      href="/support"
                      className="text-primary hover:underline"
                    >
                      Visit our Support Center
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're here to help. Contact our support team for any privacy-related
            questions or concerns.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/support">
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
