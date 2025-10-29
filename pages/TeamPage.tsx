import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail } from "lucide-react";

export default function TeamPage() {
  const teamMember = {
    name: "Md. Shakil Anower Samrat",
    role: "CEO of Softsasi",
    bio: "Visionary entrepreneur and technology leader with expertise in AI and software development. Founder and CEO of Softsasi, passionate about creating innovative solutions that democratize advanced technology for everyone.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-22_23-43-32.jpg-x58G7RHLdQalFYumBCJVCCJ2aVmsgL.jpeg",
    social: {
      linkedin: "#",
      github: "#",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-xl">LumenFrame</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link href="/team" className="text-sm font-medium text-primary">
              Team
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Meet the Founder of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              {" "}
              LumenFrame
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            LumenFrame is created by a passionate entrepreneur dedicated to
            making professional AI-powered image editing accessible to everyone
            through innovative technology.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    <img
                      src={teamMember.image || "/placeholder.svg"}
                      alt={teamMember.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {teamMember.name}
                    </h3>
                    <Badge variant="secondary" className="mb-4 text-sm">
                      {teamMember.role}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
                      {teamMember.bio}
                    </p>
                    <div className="flex justify-center space-x-4">
                      {teamMember.social.linkedin && (
                        <Link
                          href={teamMember.social.linkedin}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Link>
                      )}
                      {teamMember.social.github && (
                        <Link
                          href={teamMember.social.github}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We push the boundaries of what's possible with AI-powered image
                editing, constantly exploring new technologies and techniques.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Professional-grade image editing should be available to
                everyone, regardless of technical expertise or budget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Privacy</h3>
              <p className="text-muted-foreground">
                Your images and data are yours. We prioritize user privacy and
                security in everything we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-muted-foreground mb-8">
            We're always looking for talented individuals who share our passion
            for AI and creative technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button size="lg">
                <Mail className="mr-2 h-4 w-4" />
                View Open Positions
              </Button>
            </Link>
            <Link href="mailto:careers@lumenframe.com">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-xl">LumenFrame</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Next-generation AI-powered photo editing for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/team"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:hello@lumenframe.com"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Email
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 LumenFrame. All rights reserved.</p>
            <p className="mt-2">
              LumenFrame is created by Shakil Anower Samrat
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
