"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, ExternalLink, Zap, Shield, Globe } from "lucide-react";

export default function APIDocsPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/generate-image",
      description: "Generate new images from text descriptions",
      parameters: [
        {
          name: "prompt",
          type: "string",
          required: true,
          description: "Text description of the image to generate",
        },
        {
          name: "style",
          type: "string",
          required: false,
          description: "Style preference (realistic, artistic, etc.)",
        },
        {
          name: "aspectRatio",
          type: "string",
          required: false,
          description: "Aspect ratio (1:1, 16:9, 9:16, 4:3)",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/process-image",
      description: "Edit existing images with natural language commands",
      parameters: [
        {
          name: "imageData",
          type: "string",
          required: true,
          description: "Base64 encoded image data",
        },
        {
          name: "editInstructions",
          type: "array",
          required: true,
          description: "Array of edit instruction objects",
        },
        {
          name: "command",
          type: "string",
          required: true,
          description: "Natural language editing command",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/analyze-command",
      description: "Analyze natural language commands for image editing",
      parameters: [
        {
          name: "command",
          type: "string",
          required: true,
          description: "Natural language command to analyze",
        },
        {
          name: "imageData",
          type: "string",
          required: false,
          description: "Base64 encoded image data for context",
        },
      ],
    },
  ];

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
            <Link href="/api-docs" className="text-sm font-medium text-primary">
              API
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
            LumenFrame
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              {" "}
              API
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Integrate AI-powered image generation and editing into your
            applications with our simple, powerful API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">
                Get API Access
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Code className="mr-2 h-4 w-4" />
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose LumenFrame API?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate and edit images in seconds with our optimized AI
                  models and global CDN infrastructure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bank-level security with encrypted data transmission and
                  secure image processing pipelines.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Global Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built to handle millions of requests with 99.9% uptime and
                  automatic scaling worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            API Reference
          </h2>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Auth</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The LumenFrame API provides programmatic access to our
                    AI-powered image generation and editing capabilities. All
                    API endpoints are RESTful and return JSON responses.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-mono text-sm">
                      Base URL: https://api.lumenframe.com/v1
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Rate Limits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Free tier: 100 requests per hour</li>
                      <li>• Pro tier: 1,000 requests per hour</li>
                      <li>• Enterprise: Custom limits</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Authenticate your API requests using your API key in the
                    Authorization header.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Getting Your API Key</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Sign up for a LumenFrame account</li>
                      <li>Navigate to your dashboard</li>
                      <li>Go to API Settings</li>
                      <li>Generate a new API key</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          endpoint.method === "POST" ? "default" : "secondary"
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <p className="text-muted-foreground">
                      {endpoint.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div
                              key={paramIndex}
                              className="flex items-start gap-4 text-sm"
                            >
                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {param.name}
                              </code>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    {param.type}
                                  </span>
                                  {param.required && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                  {param.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Generate Image</h4>
                    <div className="bg-muted p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(`fetch('https://api.lumenframe.com/v1/generate-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over mountains',
    style: 'realistic',
    aspectRatio: '16:9'
  })
})`)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        {`fetch('https://api.lumenframe.com/v1/generate-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over mountains',
    style: 'realistic',
    aspectRatio: '16:9'
  })
})`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Edit Image</h4>
                    <div className="bg-muted p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(`fetch('https://api.lumenframe.com/v1/process-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageData: 'data:image/jpeg;base64,/9j/4AAQ...',
    command: 'Remove the background and make it white',
    editInstructions: [
      { type: 'remove', target: 'background' },
      { type: 'add', target: 'background', color: 'white' }
    ]
  })
})`)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        {`fetch('https://api.lumenframe.com/v1/process-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageData: 'data:image/jpeg;base64,/9j/4AAQ...',
    command: 'Remove the background and make it white',
    editInstructions: [
      { type: 'remove', target: 'background' },
      { type: 'add', target: 'background', color: 'white' }
    ]
  })
})`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers using LumenFrame API to power their
            applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">
                Get Your API Key
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg">
                Contact Support
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
                    href="/api-docs"
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
          </div>
        </div>
      </footer>
    </div>
  );
}
