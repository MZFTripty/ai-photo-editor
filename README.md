# LumenFrame - AI Photo Editor

A professional web-based photo editing application powered by AI. Edit images with natural language commands, generate images from text, and apply professional transformations.

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
```

Visit: **http://localhost:3001/editor**

---

## ✨ Features

### 📸 Image Editing

- **Basic Adjustments**: Brightness, contrast, exposure, shadows, highlights
- **Color Controls**: Saturation, vibrance, hue, temperature, tint
- **3D & Perspective**: Transform with perspective and skew effects
- **Text Overlay**: Add customizable text with styling
- **Selection Tools**: Draw selections to edit specific areas
- **Sticker Support**: Add decorative elements

### 🤖 AI Features

- **Natural Language Commands**: Describe edits in plain English
- **AI Image Generation**: Create images from text descriptions
- **Batch Processing**: Process multiple images efficiently
- **Safety Features**: Content moderation and filtering

### 📱 User Experience

- **Responsive Design**: Works on desktop, tablet, mobile
- **Real-time Preview**: See changes instantly
- **Undo/Redo**: Full edit history support
- **Multiple Export Formats**: Save as PNG, JPG, WebP
- **IndexedDB Storage**: Local image persistence

---

## 🔧 Fixed Issues (November 3, 2025)

### ✅ Issue #1: Reset Buttons

**Status**: Enhanced with comprehensive logging  
**How to test**: Upload image → Adjust brightness → Click Reset → Check console logs

### ✅ Issue #2: Text Layer Height

**Status**: FIXED - Delete button repositioning  
**Fix**: Changed button from `-top-6 -right-6` to `top-0 right-0` with transform  
**Result**: Text no longer causes image container expansion

### ✅ Issue #3: 3D Transform

**Status**: Enhanced with comprehensive logging  
**How to test**: Upload image → Adjust Perspective Z → Click Apply Transform → Check console logs

---

## 📁 Project Structure

```
LumenFrame/
├── app/                      # Next.js app router
│   ├── api/                  # API routes
│   ├── editor/               # Main editor page
│   └── layout.tsx
├── components/               # React components
│   ├── editing-tools-panel.tsx
│   ├── selection-canvas.tsx
│   ├── text-overlay.tsx
│   └── ...other components
├── lib/                       # Utility functions
│   ├── image-processing-service.ts
│   └── ...other utilities
├── public/                    # Static assets
├── styles/                    # Global styles
└── package.json
```

---

## 🛠️ Key Components

### EditingToolsPanel

Provides UI controls for:

- Basic adjustments (brightness, contrast, exposure)
- Color controls (saturation, vibrance, hue, temperature, tint)
- 3D transforms (perspective, skew, warp)
- Text and sticker tools

### SelectionCanvas

Enables:

- Pen, rectangle, and circle selections
- Real-time visual feedback
- Selection statistics
- Transform application

### TextOverlay

Features:

- Draggable text layers
- Customizable font, size, color
- Delete button positioned at corner (not outside)
- Selection highlighting

---

## 💻 Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **AI**: Google Gemini API
- **Storage**: IndexedDB (client-side)
- **Image Processing**: Canvas API, WebGL
- **Build**: Webpack, Turbopack

---

## 🔌 API Integration

### Environment Variables

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Key API Routes

- `POST /api/generate-image` - Generate images from text
- `POST /api/process-image` - Apply edits to images
- `POST /api/batch-process` - Batch image processing

---

## 🧪 Testing

### Development Console

Enable browser DevTools (F12) to see:

- Component state changes
- API request/response logs
- Transform calculations
- Selection operations
- Image processing status

### Console Log Prefixes

- 🎬 = Function entry point
- 🔄 = Reset operations
- ✅ = Success confirmation
- ❌ = Error/failure
- 📤 = Data being sent
- 🎨 = CSS/visual operations
- 📐 = Transform calculations
- 📸 = Image operations

---

## 🐛 Known Issues & Fixes

### Text Height Expansion (FIXED)

**Problem**: Adding text made image container grow  
**Solution**: Repositioned delete button from outside to inside corner  
**Files**: `components/text-overlay.tsx`, `pages/EditorPage.tsx`

---

## 📝 Development Notes

### Recent Changes (Nov 3, 2025)

1. Fixed text overlay delete button positioning
2. Added `overflow-hidden` safety to image container
3. Enhanced logging for reset button flow
4. Enhanced logging for 3D transform flow
5. Comprehensive documentation of all features

### Code Quality

- TypeScript strict mode enabled
- Tailwind CSS for all styling
- Component-based architecture
- Proper error handling
- Comprehensive logging for debugging

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy
```

---

## 📞 Support & Documentation

### Quick References

- **Editor**: http://localhost:3001/editor
- **API Docs**: http://localhost:3001/api-docs
- **Features**: Explore in-app UI for full capabilities

### Troubleshooting

1. **Images not loading**: Check API key in environment variables
2. **Edits not applying**: Check browser console for error logs
3. **Storage issues**: Clear IndexedDB if corrupted
4. **Performance issues**: Check image resolution and browser resources

---

## 📄 License

MIT License - Free to use and modify

---

## 🎉 Credits

Built with Next.js, React, and Google Gemini AI

---

**LumenFrame** - Professional Photo Editing Made Simple ✨

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
├── app/ # Next.js app directory
│ ├── api/ # API routes
│ │ ├── analyze-command/
│ │ ├── generate-image/
│ │ └── process-image/
│ ├── auth/ # Authentication pages
│ ├── editor/ # Main editor interface
│ └── (marketing)/ # Marketing pages
├── components/ # React components
│ ├── ui/ # Base UI components
│ ├── command-interface.tsx
│ ├── image-upload.tsx
│ └── editing-tools-panel.tsx
├── lib/ # Utility libraries
│ ├── gemini-service.ts
│ └── image-processing-service.ts
└── public/ # Static assets
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
maxSize={10 _ 1024 _ 1024} // 10MB
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
COPY package\*.json ./
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

_CEO of Softsasi_

[⭐ Star this repo](https://github.com/your-username/lumenframe) • [🐛 Report Bug](https://github.com/your-username/lumenframe/issues) • [💡 Request Feature](https://github.com/your-username/lumenframe/issues)

</div>
