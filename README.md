# LumenFrame - Next-Generation AI Photo Editor

<div align="center">

![LumenFrame Logo](https://img.shields.io/badge/LumenFrame-AI%20Photo%20Editor-d946ef?style=for-the-badge&logo=sparkles)

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)


**Transform your images with natural language commands. Professional AI photo editing made simple and accessible.**

[🚀 Try LumenFrame](https://your-deployment-url.vercel.app) • [📖 Documentation](#documentation) • [🎯 Features](#features) • [🛠️ API](#api-reference)

</div>

---

## 🌟 Overview

LumenFrame is a revolutionary web-based photo editing application that democratizes professional image editing through the power of AI. Simply describe what you want to change in plain English, and our advanced AI will understand and execute your creative vision with professional-quality results.

### ✨ Key Highlights

- **🆓 Completely Free** - No subscriptions, usage limits, or hidden costs
- **🗣️ Natural Language Interface** - Edit photos by describing what you want
- **⚡ Lightning Fast** - Professional results in under 90 seconds
- **🎨 AI Image Generation** - Create images from text descriptions
- **🛡️ Ethical AI** - Built-in safeguards and transparency features
- **📱 Responsive Design** - Works seamlessly across all devices

---

## 🎯 Features

### 🤖 AI-Powered Editing
- **Natural Language Commands**: Describe edits in plain English
- **Intelligent Analysis**: AI understands context and intent
- **Multi-step Instructions**: Handle complex editing workflows
- **Smart Suggestions**: Personalized recommendations based on image content

### 🎨 Image Generation
- **Text-to-Image**: Generate high-quality images from descriptions
- **Multiple Styles**: Photorealistic, artistic, cartoon, vintage, and more
- **Flexible Formats**: Support for various aspect ratios (1:1, 16:9, 9:16, 4:3, 3:2)
- **High Resolution**: Up to 4K image generation

### 🛠️ Professional Tools
- **Selection Tools**: Pen, rectangle, and circle selection modes
- **Manual Transformations**: Crop, resize, rotate, flip operations
- **Color Adjustments**: Brightness, contrast, saturation, hue, temperature
- **3D Transforms**: Warp, skew, perspective transformations
- **Text & Shapes**: Add text overlays and geometric shapes

### 🔄 Batch Processing
- **Multiple Images**: Process multiple images simultaneously
- **Command Macros**: Save and reuse editing commands
- **Queue Management**: Intelligent processing with progress tracking

### 🛡️ Safety & Ethics
- **Identity Preservation**: Maintains facial features and characteristics
- **Content Policy**: Prevents inappropriate or harmful edits
- **Consent Verification**: Ensures proper permissions
- **Provenance Tracking**: Complete edit history with cryptographic signatures

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- Supabase account (optional, for user features)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/lumenframe.git
   cd lumenframe
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your API keys:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

### 🏗️ Architecture

LumenFrame is built with modern web technologies:

- **Frontend**: Next.js 14 with TypeScript and React 18
- **UI Components**: Radix UI with Tailwind CSS
- **AI Integration**: Google Gemini AI (2.5-flash models)
- **Authentication**: Supabase
- **Deployment**: Vercel with automatic CI/CD

### 📁 Project Structure

\`\`\`
lumenframe/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze-command/
│   │   ├── generate-image/
│   │   └── process-image/
│   ├── auth/              # Authentication pages
│   ├── editor/            # Main editor interface
│   └── (marketing)/       # Marketing pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── command-interface.tsx
│   ├── image-upload.tsx
│   └── editing-tools-panel.tsx
├── lib/                  # Utility libraries
│   ├── gemini-service.ts
│   └── image-processing-service.ts
└── public/              # Static assets
\`\`\`

### 🎨 Core Components

#### CommandInterface
The heart of LumenFrame's natural language editing system.

\`\`\`tsx
import { CommandInterface } from '@/components/command-interface'

<CommandInterface
  onCommandSubmit={handleCommand}
  selectedImage={currentImage}
  isProcessing={isLoading}
/>
\`\`\`

#### ImageUpload
Drag-and-drop image upload with validation and preview.

\`\`\`tsx
import { ImageUpload } from '@/components/image-upload'

<ImageUpload
  onImageUpload={handleImageUpload}
  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
  maxSize={10 * 1024 * 1024} // 10MB
/>
\`\`\`

#### EditingToolsPanel
Manual editing tools for precise control.

\`\`\`tsx
import { EditingToolsPanel } from '@/components/editing-tools-panel'

<EditingToolsPanel
  selectedImage={currentImage}
  onApplyEdit={handleManualEdit}
  onManualTransform={handleTransform}
/>
\`\`\`

---

## 🔌 API Reference

### Analyze Command
Analyzes natural language commands and returns structured edit instructions.

\`\`\`http
POST /api/analyze-command
Content-Type: application/json

{
  "command": "Remove the background and make it white",
  "imageData": "data:image/jpeg;base64,..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "analysis": {
    "intent": "background_removal",
    "confidence": 0.95,
    "instructions": [
      {
        "action": "remove_background",
        "target": "background",
        "replacement": "white"
      }
    ]
  }
}
\`\`\`

### Generate Image
Creates images from text descriptions using AI.

\`\`\`http
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "A serene mountain landscape at sunset",
  "style": "photorealistic",
  "aspectRatio": "16:9"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "imageData": "data:image/png;base64,...",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png",
    "style": "photorealistic"
  }
}
\`\`\`

### Process Image
Applies AI-powered transformations to images.

\`\`\`http
POST /api/process-image
Content-Type: application/json

{
  "imageData": "data:image/jpeg;base64,...",
  "instructions": [
    {
      "action": "enhance_lighting",
      "intensity": 0.7
    }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "processedImageData": "data:image/jpeg;base64,...",
  "metadata": {
    "processingTime": 1.2,
    "operations": ["enhance_lighting"],
    "quality": "high"
  }
}
\`\`\`

---

## 🎨 Usage Examples

### Basic Photo Editing

\`\`\`javascript
// Upload an image
const imageFile = await uploadImage(file)

// Apply natural language edit
const result = await editImage(imageFile, "Make the sky more dramatic and increase contrast")

// Display result
setProcessedImage(result.imageData)
\`\`\`

### Batch Processing

\`\`\`javascript
// Process multiple images with same command
const images = [image1, image2, image3]
const command = "Brighten the image and add vintage filter"

const results = await Promise.all(
  images.map(img => processImage(img, command))
)
\`\`\`

### AI Image Generation

\`\`\`javascript
// Generate image from text
const generatedImage = await generateImage({
  prompt: "A cozy coffee shop interior with warm lighting",
  style: "photorealistic",
  aspectRatio: "4:3"
})
\`\`\`

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

\`\`\`env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional (for user features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Adding New Features

1. **Create component** in `components/`
2. **Add API route** in `app/api/`
3. **Update types** in `lib/types.ts`
4. **Add tests** in `__tests__/`
5. **Update documentation**

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start production server
npm run start
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for public APIs
- Write tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Powering our AI capabilities
- **Vercel** - Hosting and deployment platform
- **Supabase** - Authentication and database services
- **Radix UI** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

- **Documentation**: [docs.lumenframe.com](https://docs.lumenframe.com)
- **Support Email**: [support@lumenframe.com](mailto:support@lumenframe.com)
- **GitHub Issues**: [Report a bug](https://github.com/your-username/lumenframe/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/lumenframe)

---

## 🗺️ Roadmap

### 🎯 Current Focus
- [ ] Advanced selection tools
- [ ] Video editing capabilities
- [ ] Mobile app development
- [ ] API rate limiting and optimization

### 🔮 Future Plans
- [ ] Plugin system for custom effects
- [ ] Collaborative editing features
- [ ] Advanced AI models integration
- [ ] Enterprise features and SSO

---

<div align="center">

**Built with ❤️ by [Md. Shakil Anower Samrat](https://github.com/ShakilAnowerSamrat)**

*CEO of Softsasi*

[⭐ Star this repo](https://github.com/your-username/lumenframe) • [🐛 Report Bug](https://github.com/your-username/lumenframe/issues) • [💡 Request Feature](https://github.com/your-username/lumenframe/issues)

</div>
