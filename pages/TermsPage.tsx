import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Users,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <Scale className="w-4 h-4" />
            Fair and Transparent
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Terms of
            <span className="text-primary"> Service</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Clear, fair terms that protect both you and LumenFrame while
            ensuring the best possible service experience.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing or using LumenFrame, you agree to be bound by
                  these Terms of Service and our Privacy Policy. If you do not
                  agree to these terms, please do not use our service. These
                  terms apply to all users, including visitors, registered
                  users, and contributors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    What LumenFrame Provides
                  </h4>
                  <p className="text-muted-foreground">
                    LumenFrame is an AI-powered photo editing platform that
                    allows users to edit images using natural language commands.
                    Our service includes image upload, AI processing, editing
                    capabilities, and result download functionality.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Availability</h4>
                  <p className="text-muted-foreground">
                    We strive to maintain high service availability but cannot
                    guarantee uninterrupted access. The service is provided "as
                    is" and may be subject to maintenance, updates, or temporary
                    outages.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Beta Status</h4>
                  <p className="text-muted-foreground">
                    LumenFrame is currently in beta. Features may change, and we
                    may experience occasional service interruptions as we
                    improve and expand our capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Security</h4>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the security of your
                    account credentials. Do not share your login information
                    with others. Notify us immediately if you suspect
                    unauthorized access to your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Content Guidelines</h4>
                  <p className="text-muted-foreground">
                    You may only upload images that you own or have permission
                    to edit. Do not upload content that is illegal, harmful,
                    offensive, or violates others' rights. This includes but is
                    not limited to copyrighted material, private images of
                    others without consent, or content promoting violence or
                    discrimination.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Acceptable Use</h4>
                  <p className="text-muted-foreground">
                    Use LumenFrame only for legitimate photo editing purposes.
                    Do not attempt to reverse engineer, hack, or abuse our
                    service. Do not use our service to create misleading,
                    deceptive, or harmful content.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-6 h-6 text-primary" />
                  Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Your Content</h4>
                  <p className="text-muted-foreground">
                    You retain all rights to the images you upload and the
                    edited results. By using our service, you grant us a
                    temporary license to process your images solely for the
                    purpose of providing our editing services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Our Service</h4>
                  <p className="text-muted-foreground">
                    LumenFrame and all related technology, software, and
                    intellectual property are owned by us or our licensors. You
                    may not copy, modify, distribute, or create derivative works
                    based on our service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI-Generated Content</h4>
                  <p className="text-muted-foreground">
                    Content generated or modified by our AI models is provided
                    to you for your use. However, we cannot guarantee that
                    AI-generated content is free from third-party rights or
                    claims.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  Limitations and Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Limitations</h4>
                  <p className="text-muted-foreground">
                    While we strive for accuracy, AI-generated edits may not
                    always meet your expectations. Results may vary based on
                    image quality, complexity, and the nature of requested
                    edits. We do not guarantee specific outcomes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Liability Disclaimer</h4>
                  <p className="text-muted-foreground">
                    LumenFrame is provided "as is" without warranties of any
                    kind. We are not liable for any damages arising from your
                    use of our service, including but not limited to data loss,
                    business interruption, or unsatisfactory results.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Third-Party Services</h4>
                  <p className="text-muted-foreground">
                    Our service integrates with third-party AI models and
                    infrastructure. We are not responsible for the performance,
                    availability, or policies of these third-party services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Termination and Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Termination</h4>
                  <p className="text-muted-foreground">
                    You may delete your account at any time. We may suspend or
                    terminate accounts that violate these terms or engage in
                    harmful behavior. Upon termination, your access to the
                    service will cease, and your data will be deleted according
                    to our Privacy Policy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Changes</h4>
                  <p className="text-muted-foreground">
                    We may modify, suspend, or discontinue any aspect of our
                    service at any time. We will provide reasonable notice of
                    significant changes when possible.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Terms Updates</h4>
                  <p className="text-muted-foreground">
                    We may update these terms periodically. Continued use of our
                    service after changes constitutes acceptance of the new
                    terms. We will notify users of material changes via email or
                    service notifications.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> legal@lumenframe.ai
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            By creating an account, you agree to these terms and can start
            editing your photos with AI immediately.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/auth/sign-up">
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
