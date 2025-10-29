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
  Upload,
  MessageSquare,
  Brain,
  Download,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="text-primary font-medium">
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
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Simple Yet Powerful
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            How LumenFrame
            <span className="text-primary"> Works</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Discover the magic behind natural language photo editing. Our AI
            understands your creative vision and brings it to life in just a few
            simple steps.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/auth/sign-up">
              <Upload className="w-5 h-5 mr-2" />
              Try It Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Four Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From upload to download, the entire process takes less than 2
              minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    1
                  </span>
                </div>
                <CardTitle>Upload Your Image</CardTitle>
                <CardDescription>
                  Drag and drop your photo or generate a new one with AI.
                  Supports all major formats up to 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>JPG, PNG, WebP support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Instant preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Secure processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">
                    2
                  </span>
                </div>
                <CardTitle>Describe Your Edit</CardTitle>
                <CardDescription>
                  Tell us what you want in plain English. Be as specific or
                  creative as you like.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Natural language processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Context understanding</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Smart suggestions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    3
                  </span>
                </div>
                <CardTitle>AI Processing</CardTitle>
                <CardDescription>
                  Our advanced AI analyzes your image and applies the requested
                  edits with precision.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Real-time progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Quality preservation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Safety checks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">
                    4
                  </span>
                </div>
                <CardTitle>Download Result</CardTitle>
                <CardDescription>
                  Review your edited image and download in high quality.
                  Continue editing if needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Before/after comparison</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Multiple formats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Edit history</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Commands */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Example Commands
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how natural language translates into professional edits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Background Removal</CardTitle>
                <CardDescription>
                  "Remove the background and make it white"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center text-xs">
                      Original
                    </div>
                    <div className="aspect-video bg-white border-2 border-dashed border-muted-foreground rounded flex items-center justify-center text-xs">
                      Clean Background
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for product photos and portraits
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Color Enhancement</CardTitle>
                <CardDescription>
                  "Make the sunset more vibrant and warm"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-video bg-gradient-to-br from-orange-200 to-orange-300 rounded flex items-center justify-center text-xs">
                      Original
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-400 rounded flex items-center justify-center text-xs">
                      Enhanced
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Intelligent color grading and enhancement
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Object Removal</CardTitle>
                <CardDescription>
                  "Remove the person in the background"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-video bg-gradient-to-br from-green-200 to-green-300 rounded flex items-center justify-center text-xs">
                      With Distraction
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-green-200 to-green-300 rounded flex items-center justify-center text-xs">
                      Clean Scene
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seamless object removal with inpainting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Lightning Fast Results
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our optimized AI pipeline delivers professional quality in record
              time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border text-center">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-primary">
                  Less than 90 seconds
                </CardTitle>
                <CardDescription>
                  Average processing time for complex edits
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-accent">
                  99.2%
                </CardTitle>
                <CardDescription>
                  Command understanding accuracy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-primary">
                  4K
                </CardTitle>
                <CardDescription>Maximum resolution support</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Experience the Magic?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have transformed their editing
            workflow with natural language commands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/sign-up">
                <Upload className="w-5 h-5 mr-2" />
                Start Editing Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
              asChild
            >
              <Link href="/features">
                View All Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
