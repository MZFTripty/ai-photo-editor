import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                LumenFrame Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              See LumenFrame in Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how easy it is to edit photos using natural language
              commands with our AI-powered editor.
            </p>
          </div>

          {/* YouTube Video Embed */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <div className="aspect-video bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/oCUvGC9bl0w"
                title="LumenFrame Demo - AI Photo Editor"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Try It Yourself?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start editing your photos with natural language commands in
              seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/editor">Start Editing Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                asChild
              >
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
