<div align="center">

# 🎨 LumenFrame - Professional AI Photo Editor

### Transform Your Images with AI-Powered Editing

**LumenFrame** is a cutting-edge web-based photo editing application that combines professional-grade editing tools with AI intelligence. Edit images using natural language commands, apply advanced transformations, and create stunning visuals—all in your browser.

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [📖 Documentation](#-how-to-use) • [🛠️ Tech Stack](#-technology-stack) • [🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 🌟 Why LumenFrame?

✅ **No Installation Required** - Works entirely in your browser  
✅ **AI-Powered Editing** - Describe edits in plain English  
✅ **Professional Tools** - Industry-standard adjustments and transforms  
✅ **Privacy First** - All processing happens locally on your device  
✅ **Free & Open Source** - Use, modify, and contribute freely  
✅ **Real-Time Preview** - See changes instantly as you edit

---

## 🚀 Quick Start

### For Users

1. **Visit the Editor** (if deployed):

   ```
   https://your-lumenframe-app.vercel.app/editor
   ```

2. **Upload an Image**: Drag & drop or click to browse

3. **Start Editing**: Use the tools panel or AI commands

4. **Export**: Download your edited masterpiece!

### For Developers

```bash
# 1. Clone the repository
git clone https://github.com/MZFTripty/ai-photo-editor.git
cd ai-photo-editor

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set up environment variables (optional for AI features)
cp .env.example .env.local
# Add your Gemini API key to .env.local

# 4. Run development server
npm run dev

# 5. Open your browser
# Visit: http://localhost:3000/editor
```

**That's it!** 🎉 You're ready to start editing!

---

## ✨ Features

### 🎨 **Manual Editing Tools**

<table>
<tr>
<td width="50%">

#### Basic Adjustments

- 🔆 **Brightness** - Lighten or darken
- 🌓 **Contrast** - Enhance differences
- ☀️ **Exposure** - Control light levels
- 🌑 **Shadows** - Brighten dark areas
- ✨ **Highlights** - Tame bright areas

</td>
<td width="50%">

#### Color Controls

- 🎨 **Saturation** - Color intensity
- 🌈 **Vibrance** - Smart saturation
- 🔄 **Hue** - Shift color spectrum
- 🌡️ **Temperature** - Warm/cool tones
- 💚 **Tint** - Green/magenta balance

</td>
</tr>
<tr>
<td width="50%">

#### 3D Transformations

- 📐 **Perspective** - 3D rotation effects
- 🔀 **Skew** - Warp and distort
- 🔄 **Rotate** - Precise angle control
- ↔️ **Flip** - Mirror horizontally/vertically

</td>
<td width="50%">

#### Creative Tools

- 📝 **Text Overlay** - Add custom text
- 🎭 **Stickers** - Emoji & decorations
- ✂️ **Selection Tools** - Area-specific edits
- 🖼️ **Crop** - Resize and frame

</td>
</tr>
</table>

### 🤖 **AI-Powered Features**

- **🗣️ Natural Language Editing**: "Make the sky more blue" or "Remove background"
- **🎨 AI Image Generation**: Create images from text descriptions
- **📦 Batch Processing**: Apply edits to multiple images at once
- **🛡️ Safety Filters**: Content moderation and ethical guidelines
- **🔍 Smart Suggestions**: AI-powered editing recommendations

### 💾 **Export & Storage**

- **📥 Multiple Formats**: PNG, JPEG, WebP
- **💿 Local Storage**: IndexedDB for session persistence
- **📤 High Quality**: Export with original quality preserved
- **⚡ Fast Processing**: Optimized for performance

---

## 📖 How to Use

### 1️⃣ **Upload Your Image**

<table>
<tr>
<td width="40%">

**Drag & Drop**  
Simply drag an image file into the editor area

**Click to Browse**  
Click the upload area to select from your files

**Supported Formats**  
JPG, PNG, WebP, GIF

**Max Size**  
Up to 10MB per image

</td>
<td width="60%">

```bash
Supported Image Types:
✅ JPEG/JPG (.jpg, .jpeg)
✅ PNG (.png)
✅ WebP (.webp)
✅ GIF (.gif)

Recommended Size:
📏 Up to 4000x4000 pixels
💾 File size under 10MB
🎯 1920x1080 for best performance
```

</td>
</tr>
</table>

### 2️⃣ **Choose Your Editing Method**

#### 🎛️ **Method A: Manual Tools**

```plaintext
1. Open "Editing Tools" panel on the left
2. Choose a category:
   • Basic Adjustments
   • Color Controls
   • 3D Transforms
   • Text & Stickers
3. Adjust sliders or add elements
4. Click "Apply" to confirm
5. Use "Reset" to undo changes
```

#### 🤖 **Method B: AI Commands** (Requires API Key)

```plaintext
1. Type your command in plain English
2. Examples:
   • "Make the image brighter"
   • "Increase contrast by 20%"
   • "Rotate the image 90 degrees"
   • "Add a vintage filter"
3. Press Enter or click "Process"
4. Watch AI apply the edits!
```

### 3️⃣ **Fine-Tune with Advanced Tools**

#### **Add Text**

```plaintext
1. Click "Add Text" button
2. Type your text
3. Drag to position
4. Customize:
   • Font family
   • Font size
   • Color
   • Bold/Italic
5. Click delete (×) to remove
```

#### **Add Stickers**

```plaintext
1. Click "Add Sticker"
2. Choose an emoji
3. Drag to reposition
4. Resize by dragging corners
5. Rotate using the handle
6. Delete with (×) button
```

#### **Make Selections**

```plaintext
1. Choose selection tool:
   • Pen (freehand)
   • Rectangle
   • Circle
2. Draw on the image
3. Apply edits only to selected area
4. Clear selection when done
```

### 4️⃣ **Export Your Masterpiece**

```plaintext
1. Click "Export" button
2. Choose format (PNG recommended)
3. Image downloads automatically
4. Includes all edits, text, and stickers!

Pro Tip: Export creates a new file,
         your original is never modified.
```

---

## 🛠️ Technology Stack

<table>
<tr>
<td width="50%">

### **Frontend**

- ⚛️ **React 18** - UI library
- ⚡ **Next.js 14** - React framework
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Radix UI** - Accessible components

</td>
<td width="50%">

### **Backend & AI**

- 🤖 **Google Gemini AI** - Natural language processing
- 🗄️ **IndexedDB** - Local storage
- 🎨 **Canvas API** - Image processing
- 🔐 **Supabase** - Authentication (optional)

</td>
</tr>
</table>

### **Key Libraries**

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@radix-ui/react-*": "Latest",
  "canvas-manipulation": "Built-in"
}
```

---

## 📁 Project Structure

```plaintext
LumenFrame/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 api/                      # API Routes
│   │   ├── analyze-command/         # AI command parser
│   │   ├── generate-image/          # AI image generation
│   │   └── process-image/           # Image processing
│   │
│   ├── 📂 editor/                   # Main editor page
│   │   └── page.tsx                 # Editor UI
│   │
│   ├── 📂 auth/                     # Authentication
│   ├── 📂 features/                 # Features page
│   ├── 📂 pricing/                  # Pricing page
│   └── layout.tsx                   # Root layout
│
├── 📂 components/                   # React Components
│   ├── 📂 ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ... (more UI components)
│   │
│   ├── command-interface.tsx        # AI command input
│   ├── image-upload.tsx             # Image uploader
│   ├── editing-tools-panel.tsx      # Manual tools
│   ├── text-overlay.tsx             # Text layer
│   ├── sticker-layer.tsx            # Sticker layer
│   ├── selection-canvas.tsx         # Selection tools
│   └── image-preview.tsx            # Preview display
│
├── � lib/                          # Utilities & Services
│   ├── gemini-service.ts            # AI integration
│   ├── image-processing-service.ts  # Image processing
│   ├── command-parser.ts            # Command parsing
│   ├── crop-utils.ts                # Crop utilities
│   └── utils.ts                     # Helper functions
│
├── 📂 pages/                        # Page Components
│   ├── EditorPage.tsx               # Main editor logic
│   ├── LumenFrameHome.tsx           # Homepage
│   └── ... (other pages)
│
├── 📂 public/                       # Static Assets
├── 📂 styles/                       # Global Styles
│
├── .env.local                       # Environment variables
├── next.config.mjs                  # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies

```

---

## ⚙️ Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# ============================================
# GEMINI AI (Optional - for AI features)
# ============================================
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Get your key: https://makersuite.google.com/app/apikey

# ============================================
# SUPABASE (Optional - for user accounts)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ============================================
# DEVELOPMENT
# ============================================
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# ============================================
# NOTES
# ============================================
# - App works without API keys (manual tools only)
# - Gemini API key required for AI features
# - Supabase optional for user authentication
```

### **Without API Keys**

LumenFrame works perfectly fine without any API keys! You can use:

- ✅ All manual editing tools
- ✅ Text and sticker features
- ✅ 3D transformations
- ✅ Export functionality
- ❌ AI commands (requires Gemini API)
- ❌ User accounts (requires Supabase)

---

## 🎯 Usage Examples

### **Example 1: Basic Photo Enhancement**

```typescript
// User workflow
1. Upload portrait photo
2. Increase brightness: +20
3. Increase contrast: +15
4. Adjust temperature: +10 (warmer)
5. Apply and export

// Result: Warmer, more vibrant portrait
```

### **Example 2: Add Text Watermark**

```typescript
// User workflow
1. Upload image
2. Click "Add Text"
3. Type "© 2025 Your Name"
4. Customize:
   - Font: Arial
   - Size: 24px
   - Color: White with shadow
5. Drag to bottom-right corner
6. Export with watermark

// Result: Watermarked image
```

### **Example 3: Create Social Media Post**

```typescript
// User workflow
1. Upload photo
2. Apply 3D perspective: Z-axis 15°
3. Increase saturation: +30
4. Add text: "Follow @YourHandle"
5. Add emoji sticker: 🎉
6. Export as PNG

// Result: Eye-catching social media image
```

### **Example 4: Batch Process Multiple Images**

```typescript
// With AI commands
1. Upload multiple images
2. Command: "Increase brightness by 20% and add vintage effect"
3. AI processes all images
4. Download all edited versions

// Result: Consistently edited photo set
```

---

## 🔧 Recent Bug Fixes & Improvements

### ✅ **Fixed: Text Layer Causing Image Size Changes** (Nov 3-6, 2025)

**Problem**: Adding text or selecting text layers caused the image container to expand unexpectedly, breaking layout and 3D transforms.

**Solution**:

- Repositioned delete button from outside container to inside
- Added overflow protection
- Implemented proper pointer-events strategy

**Status**: ✅ **FULLY RESOLVED**

### ✅ **Fixed: Features Not Working Together** (Nov 5, 2025)

**Problem**: When text was added, stickers couldn't be dragged or deleted.

**Solution**:

- Implemented z-index layering (SelectionCanvas → TextOverlay → StickerLayer)
- Added pointer-events passthrough (`pointer-events: none` on containers)
- Individual items have `pointer-events: auto`

**Status**: ✅ **FULLY RESOLVED**

### ✅ **Fixed: Export Not Including Text & Stickers** (Nov 5, 2025)

**Problem**: Exported images only showed basic adjustments, missing text and stickers.

**Solution**:

- Implemented canvas-based export
- Composite all layers (image + stickers + text)
- Uses actual displayed dimensions for accuracy

**Status**: ✅ **FULLY RESOLVED**

### ✅ **Fixed: Export Position & Size Issues** (Nov 6, 2025)

**Problem**: Text and sticker positions were wrong in exported images, and file sizes were huge.

**Solution**:

- Get actual displayed image dimensions from DOM
- Use percentage-based positioning for stickers
- Match canvas size to displayed size exactly
- Proper scaling for all elements

**Status**: ✅ **FULLY RESOLVED**

---

## 🐛 Troubleshooting

### **Issue: Images Not Loading**

**Symptoms**: Blank editor, no image appears after upload

**Solutions**:

```plaintext
1. Check file format (must be JPG, PNG, WebP, or GIF)
2. Verify file size is under 10MB
3. Try a different browser (Chrome recommended)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check browser console (F12) for errors
```

### **Issue: Export Not Working**

**Symptoms**: Nothing happens when clicking export button

**Solutions**:

```plaintext
1. Ensure image is fully loaded before exporting
2. Check browser allows downloads (popup blocker)
3. Try right-click → "Save image as..."
4. Check available disk space
5. Try a different format (PNG vs JPG)
```

### **Issue: Text or Stickers Not Appearing in Export**

**Symptoms**: Exported image missing text/stickers

**Solutions**:

```plaintext
✅ This should now be fixed (Nov 6, 2025)

If still occurring:
1. Refresh the page (F5)
2. Clear browser cache
3. Re-add text/stickers and try again
4. Check browser console for errors
5. Report bug on GitHub with details
```

### **Issue: Slow Performance**

**Symptoms**: Lag when adjusting sliders, slow rendering

**Solutions**:

```plaintext
1. Reduce image size (under 2000x2000 recommended)
2. Close unnecessary browser tabs
3. Clear IndexedDB storage
4. Use a modern browser (Chrome, Firefox, Edge)
5. Check available RAM (need at least 4GB free)

Optimization Tips:
• Use images around 1920x1080 for best performance
• Apply adjustments one at a time
• Avoid extremely high-resolution images
• Close other applications if needed
```

### **Issue: AI Commands Not Working**

**Symptoms**: "API key not configured" or AI commands fail

**Solutions**:

```plaintext
1. Check .env.local file exists
2. Verify NEXT_PUBLIC_GEMINI_API_KEY is set
3. Get API key from: https://makersuite.google.com/app/apikey
4. Restart development server after adding key
5. Manual editing tools work without API key!
```

### **Issue: 3D Transforms Not Visible**

**Symptoms**: Moving perspective sliders has no effect

**Solutions**:

```plaintext
1. Click "Apply Transform" button after adjusting
2. Try larger values (e.g., 45° instead of 5°)
3. Ensure image is loaded completely
4. Check if other adjustments interfere
5. Reset all transforms and try again
```

### **Issue: Text Position Wrong After Export**

**Symptoms**: Text appears in different position in exported image

**Solutions**:

```plaintext
✅ This should now be fixed (Nov 6, 2025)

If still occurring:
1. Clear browser cache and refresh
2. Make sure you're using latest version
3. Report specific case on GitHub
4. Include: browser, image size, text position
```

---

## 🚢 Deployment

### **Deploy to Vercel (Recommended)**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MZFTripty/ai-photo-editor)

### **Deploy to Netlify**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build
npm run build

# 4. Deploy
netlify deploy --prod
```

### **Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t lumenframe .
docker run -p 3000:3000 lumenframe
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### **Development Setup**

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-photo-editor.git
cd ai-photo-editor

# 3. Add upstream remote
git remote add upstream https://github.com/MZFTripty/ai-photo-editor.git

# 4. Create a branch
git checkout -b feature/amazing-feature

# 5. Make your changes

# 6. Test thoroughly
npm run build
npm run dev

# 7. Commit with clear message
git commit -m "Add: Amazing new feature"

# 8. Push to your fork
git push origin feature/amazing-feature

# 9. Open a Pull Request on GitHub
```

### **Coding Standards**

```typescript
// ✅ DO: Use TypeScript
interface ImageData {
  url: string;
  width: number;
  height: number;
}

// ✅ DO: Add comments for complex logic
// Calculate scale factor based on container size
const scale = containerWidth / imageWidth;

// ✅ DO: Use descriptive variable names
const displayedImageWidth = 800;

// ❌ DON'T: Use any type
// const data: any = ...

// ✅ DO: Handle errors properly
try {
  await processImage();
} catch (error) {
  console.error("Image processing failed:", error);
  showErrorToUser();
}
```

### **Pull Request Guidelines**

✅ **Before submitting**:

- [ ] Code builds without errors (`npm run build`)
- [ ] All existing features still work
- [ ] New features have been tested
- [ ] Code follows project style
- [ ] Commit messages are clear

📝 **PR Description should include**:

- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots (if UI changes)

---

## 📚 API Documentation

### **Analyze Command API**

Parses natural language commands into structured edit instructions.

```typescript
POST /api/analyze-command

// Request
{
  "command": "Make the image brighter and increase contrast",
  "imageData": "data:image/jpeg;base64,..."
}

// Response
{
  "success": true,
  "analysis": {
    "intent": "adjust_multiple",
    "confidence": 0.92,
    "instructions": [
      {
        "action": "brightness",
        "value": 20
      },
      {
        "action": "contrast",
        "value": 15
      }
    ]
  }
}
```

### **Generate Image API**

Creates images from text descriptions using AI.

```typescript
POST /api/generate-image

// Request
{
  "prompt": "A serene mountain landscape at sunset",
  "style": "photorealistic",
  "aspectRatio": "16:9",
  "quality": "high"
}

// Response
{
  "success": true,
  "imageData": "data:image/png;base64,...",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png",
    "generationTime": 2.3
  }
}
```

### **Process Image API**

Applies transformations to uploaded images.

```typescript
POST /api/process-image

// Request
{
  "imageData": "data:image/jpeg;base64,...",
  "instructions": [
    {
      "action": "brightness",
      "value": 20
    },
    {
      "action": "rotate",
      "degrees": 90
    }
  ]
}

// Response
{
  "success": true,
  "processedImageData": "data:image/jpeg;base64,...",
  "metadata": {
    "processingTime": 1.2,
    "appliedOperations": ["brightness", "rotate"],
    "quality": "high"
  }
}
```

---

## 📊 Performance Metrics

### **Recommended Image Sizes**

| Use Case      | Resolution | File Size | Performance  |
| ------------- | ---------- | --------- | ------------ |
| Web/Social    | 1920x1080  | < 2MB     | ⚡ Excellent |
| Print (small) | 2560x1440  | < 4MB     | ✅ Good      |
| Print (large) | 3840x2160  | < 8MB     | ⚠️ Moderate  |
| Professional  | 4000x4000  | < 10MB    | 🐌 Slower    |

### **Browser Compatibility**

| Browser | Version | Status          | Notes       |
| ------- | ------- | --------------- | ----------- |
| Chrome  | 90+     | ✅ Full Support | Recommended |
| Firefox | 88+     | ✅ Full Support | Recommended |
| Safari  | 14+     | ✅ Full Support | iOS/Mac     |
| Edge    | 90+     | ✅ Full Support | Windows     |
| Opera   | 76+     | ✅ Full Support | -           |

---

## 🔐 Privacy & Security

### **Your Data is Safe**

✅ **No Server-Side Storage**: Images are processed locally in your browser  
✅ **No Tracking**: We don't track your editing activity  
✅ **No Uploads Required**: All processing happens on your device  
✅ **IndexedDB Only**: Local browser storage for session persistence  
✅ **Optional AI**: AI features are opt-in (require API key)

### **What We DON'T Do**

❌ Store your images on our servers  
❌ Send images to third parties (except Gemini AI if you use AI features)  
❌ Track your personal information  
❌ Sell or share your data  
❌ Require account creation for basic features

---

## 📄 License

```
MIT License

Copyright (c) 2025 Md. Shakil Anower Samrat / Softsasi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Special thanks to:

- **Google Gemini AI** - Powering intelligent image editing
- **Vercel** - Hosting and deployment infrastructure
- **Next.js Team** - Amazing React framework
- **Radix UI** - Accessible component primitives
- **Tailwind Labs** - Utility-first CSS framework
- **Open Source Community** - Inspiration and support

---

## 📞 Support & Contact

### **Need Help?**

- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Bug Reports**: [Create an issue](https://github.com/MZFTripty/ai-photo-editor/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Suggest a feature](https://github.com/MZFTripty/ai-photo-editor/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/MZFTripty/ai-photo-editor/discussions)

### **Connect with the Creator**

👨‍💻 **Md. Shakil Anower Samrat**  
🏢 CEO of Softsasi  
🔗 GitHub: [@MZFTripty](https://github.com/MZFTripty)  
📧 Email: [Contact via GitHub](https://github.com/MZFTripty)

---

## 🗺️ Roadmap

### **Current Version: 1.0**

- ✅ Core editing tools
- ✅ Text and sticker support
- ✅ 3D transformations
- ✅ Export functionality
- ✅ AI command integration

### **Version 1.1** (Q1 2025)

- [ ] Advanced selection tools (magic wand, lasso)
- [ ] More filter presets (vintage, B&W, sepia)
- [ ] Layer management system
- [ ] Keyboard shortcuts
- [ ] Mobile app optimization

### **Version 2.0** (Q2 2025)

- [ ] Video editing capabilities
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Advanced AI features
- [ ] Cloud synchronization (optional)

### **Future Ideas** 🔮

- [ ] Mobile native apps (iOS/Android)
- [ ] Desktop application (Electron)
- [ ] Advanced masking tools
- [ ] RAW image support
- [ ] Batch automation scripts

**Want to influence the roadmap?** [Vote on features](https://github.com/MZFTripty/ai-photo-editor/discussions/categories/feature-requests) or contribute!

---

## ⭐ Show Your Support

If you find LumenFrame useful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐦 **Share** with your friends and colleagues
- 🐛 **Report bugs** to help us improve
- 💻 **Contribute** code or documentation
- 💬 **Provide feedback** on your experience

---

<div align="center">

### **Built with ❤️ by the LumenFrame Team**

**Transform Your Vision into Reality**

[🚀 Start Editing](http://localhost:3000/editor) • [📖 Documentation](#-how-to-use) • [🐛 Report Issue](https://github.com/MZFTripty/ai-photo-editor/issues) • [⭐ Star Repository](https://github.com/MZFTripty/ai-photo-editor)

---

**© 2025 Softsasi • LumenFrame Photo Editor**

_Making professional photo editing accessible to everyone_

</div>

### ✅ Issue #1: Text Layer Height Auto-Expansion (FIXED)

**Problem**: When adding text to an image, the image container would grow unexpectedly, breaking the layout and affecting 3D perspective features.

**Root Cause**: Delete button (`×`) was positioned outside the container using `-top-6 -right-6` classes, causing the parent container to expand.

**Solution Implemented**:

1. **File**: `components/text-overlay.tsx` (Line 152)

   - Changed delete button positioning from `absolute -top-6 -right-6` to `absolute top-0 right-0`
   - Added `transform translate-x-1/2 -translate-y-1/2` to maintain visual appearance while staying within bounds

2. **File**: `pages/EditorPage.tsx` (Line 1901)

   - Added `overflow-hidden` to image container as safety measure
   - Ensures container never expands regardless of child elements

3. **File**: `components/text-overlay.tsx` (Line 89)
   - Confirmed `overflow-hidden` already on TextOverlay component
   - Provides additional safety layer

**Result**:

- ✅ Text layer no longer causes image container expansion
- ✅ Image height remains constant when adding/selecting text
- ✅ 3D perspective features work correctly with text overlays
- ✅ Delete button remains visible and functional at text corner
- ✅ No functionality broken - only visual layout improved

**Testing**:

1. Upload any image
2. Add text via "Add Text" button
3. **Verify**: Image container height doesn't change
4. Click on text to select it
5. **Verify**: Height still doesn't change when delete button appears
6. Test 3D transforms - should work smoothly with text layers

---

### Issue #2: Reset Buttons

**Status**: Enhanced with comprehensive logging  
**How to test**: Upload image → Adjust brightness → Click Reset → Check console logs

### Issue #3: 3D Transform

**Status**: Enhanced with comprehensive logging  
**How to test**: Upload image → Adjust Perspective Z → Click Apply Transform → Check console logs

---

## 📁 Complete Project Structure

```plaintext
LumenFrame/
│
├── 📂 app/                                    # Next.js 14 App Router
│   ├── 📄 globals.css                         # Global styles and Tailwind imports
│   ├── 📄 layout.tsx                          # Root layout with providers
│   ├── 📄 page.tsx                            # Homepage (redirects to /editor)
│   │
│   ├── 📂 api/                                # Backend API Routes
│   │   ├── 📂 analyze-command/
│   │   │   └── 📄 route.ts                    # AI command analysis endpoint
│   │   ├── 📂 generate-image/
│   │   │   └── 📄 route.ts                    # AI image generation endpoint
│   │   └── 📂 process-image/
│   │       └── 📄 route.ts                    # Image processing endpoint
│   │
│   ├── 📂 api-docs/                           # API Documentation Page
│   │   └── 📄 page.tsx                        # Interactive API docs
│   │
│   ├── 📂 auth/                               # Authentication Pages
│   │   ├── 📂 login/
│   │   │   └── 📄 page.tsx                    # Login page
│   │   └── 📂 sign-up/
│   │       └── 📄 page.tsx                    # Sign up page
│   │
│   ├── 📂 demo/                               # Demo/Preview Page
│   │   └── 📄 page.tsx                        # Live demo showcase
│   │
│   ├── 📂 editor/                             # ⭐ Main Editor Page
│   │   └── 📄 page.tsx                        # Photo editor interface
│   │
│   ├── 📂 features/                           # Features Page
│   │   └── 📄 page.tsx                        # Feature showcase
│   │
│   ├── 📂 how-it-works/                       # How It Works Page
│   │   └── 📄 page.tsx                        # Tutorial and guide
│   │
│   ├── 📂 pricing/                            # Pricing Page
│   │   └── 📄 page.tsx                        # Pricing tiers
│   │
│   ├── 📂 privacy/                            # Privacy Policy Page
│   │   └── 📄 page.tsx                        # Privacy information
│   │
│   ├── 📂 support/                            # Support Page
│   │   ├── 📄 loading.tsx                     # Loading state
│   │   └── 📄 page.tsx                        # Support and help
│   │
│   ├── 📂 team/                               # Team Page
│   │   └── 📄 page.tsx                        # Team information
│   │
│   └── 📂 terms/                              # Terms of Service Page
│       └── 📄 page.tsx                        # Legal terms
│
├── 📂 components/                             # React Components
│   ├── 📄 batch-processing-panel.tsx          # Batch processing UI
│   ├── 📄 command-interface.tsx               # AI command input interface
│   ├── 📄 crop-canvas.tsx                     # Crop tool canvas
│   ├── 📄 editing-tools-panel.tsx             # Main editing tools sidebar
│   ├── 📄 image-generator.tsx                 # AI image generation UI
│   ├── 📄 image-preview.tsx                   # Image preview component
│   ├── 📄 image-transform-utils.ts            # Transform utility functions
│   ├── 📄 image-upload.tsx                    # Drag & drop upload component
│   ├── 📄 loading-overlay.tsx                 # Loading state overlay
│   ├── 📄 processing-modal.tsx                # Processing modal dialog
│   ├── 📄 safety-panel.tsx                    # Content safety panel
│   ├── 📄 selection-canvas.tsx                # Selection tools canvas
│   ├── 📄 sticker-layer.tsx                   # Sticker overlay layer
│   ├── 📄 text-overlay.tsx                    # Text overlay layer
│   ├── 📄 theme-provider.tsx                  # Dark/light theme provider
│   │
│   └── 📂 ui/                                 # Base UI Components (Radix UI + Tailwind)
│       ├── 📄 alert.tsx                       # Alert component
│       ├── 📄 badge.tsx                       # Badge component
│       ├── 📄 button.tsx                      # Button component
│       ├── 📄 card.tsx                        # Card component
│       ├── 📄 collapsible.tsx                 # Collapsible component
│       ├── 📄 dialog.tsx                      # Dialog/modal component
│       ├── 📄 input.tsx                       # Input field component
│       ├── 📄 label.tsx                       # Label component
│       ├── 📄 progress.tsx                    # Progress bar component
│       ├── 📄 scroll-area.tsx                 # Scroll area component
│       ├── 📄 select.tsx                      # Select dropdown component
│       ├── 📄 separator.tsx                   # Separator line component
│       ├── 📄 slider.tsx                      # Slider component
│       ├── 📄 tabs.tsx                        # Tabs component
│       └── 📄 textarea.tsx                    # Textarea component
│
├── 📂 lib/                                    # Utility Libraries & Services
│   ├── 📄 batch-processing-service.ts         # Batch processing logic
│   ├── 📄 command-parser.ts                   # Parse natural language commands
│   ├── 📄 crop-utils.ts                       # Crop calculation utilities
│   ├── 📄 gemini-service.ts                   # Google Gemini AI integration
│   ├── 📄 image-processing-service.ts         # Core image processing
│   ├── 📄 local-advanced-processing.ts        # Advanced local processing
│   ├── 📄 local-image-processing.ts           # Basic local processing
│   ├── 📄 provenance-service.ts               # Edit history tracking
│   ├── 📄 safety-service.ts                   # Content safety checks
│   ├── 📄 selection-suggestions.ts            # AI selection suggestions
│   ├── 📄 utils.ts                            # General utility functions
│   │
│   └── 📂 supabase/                           # Supabase Integration
│       ├── 📄 client.ts                       # Client-side Supabase client
│       ├── 📄 middleware.ts                   # Auth middleware
│       └── 📄 server.ts                       # Server-side Supabase client
│
├── 📂 pages/                                  # Page Components (Legacy)
│   ├── 📄 APIDocsPage.tsx                     # API documentation component
│   ├── 📄 DemoPage.tsx                        # Demo page component
│   ├── 📄 EditorPage.tsx                      # ⭐ Main editor logic (2172 lines)
│   ├── 📄 FeaturesPage.tsx                    # Features showcase component
│   ├── 📄 HowItWorksPage.tsx                  # How it works component
│   ├── 📄 LoginPage.tsx                       # Login page component
│   ├── 📄 LumenFrameHome.tsx                  # Homepage component
│   ├── 📄 PricingPage.tsx                     # Pricing page component
│   ├── 📄 PrivacyPage.tsx                     # Privacy policy component
│   ├── 📄 SignUpPage.tsx                      # Sign up page component
│   ├── 📄 SupportPage.tsx                     # Support page component
│   ├── 📄 TeamPage.tsx                        # Team page component
│   └── 📄 TermsPage.tsx                       # Terms page component
│
├── 📂 public/                                 # Static Assets
│   └── 📄 css-transform-test.html             # CSS transform testing file
│
├── 📂 styles/                                 # Global Styles
│   ├── 📄 globals.css                         # Global CSS styles
│   └── 📄 responsive.css                      # Responsive design styles
│
├── 📄 .env                                    # Environment variables (gitignored)
├── 📄 .env.local                              # Local environment variables (gitignored)
├── 📄 .gitignore                              # Git ignore rules
├── 📄 BROWSER_CONSOLE_TEST.js                 # Browser testing script
├── 📄 components.json                         # Shadcn UI configuration
├── 📄 middleware.ts                           # Next.js middleware (auth)
├── 📄 next-env.d.ts                           # Next.js TypeScript declarations
├── 📄 next.config.mjs                         # Next.js configuration
├── 📄 package.json                            # Dependencies and scripts
├── 📄 pnpm-lock.yaml                          # PNPM lock file
├── 📄 postcss.config.mjs                      # PostCSS configuration
├── 📄 README.md                               # 📖 This file
└── 📄 tsconfig.json                           # TypeScript configuration
```

### 📋 Key Files Explained

#### **Core Application Files**

| File                                 | Purpose                   | Key Features                                   |
| ------------------------------------ | ------------------------- | ---------------------------------------------- |
| `pages/EditorPage.tsx`               | Main editor logic & state | 2172 lines, all editing state, export function |
| `app/editor/page.tsx`                | Editor route entry point  | Renders EditorPage component                   |
| `components/editing-tools-panel.tsx` | Editing tools UI          | Sliders, controls, tool categories             |
| `lib/gemini-service.ts`              | AI integration            | Gemini API calls, prompt engineering           |
| `lib/image-processing-service.ts`    | Image processing core     | Canvas manipulation, filters, transforms       |

#### **Layer Components** (Multi-layer Architecture)

| Component              | Z-Index    | Purpose                                    |
| ---------------------- | ---------- | ------------------------------------------ |
| `selection-canvas.tsx` | z-0 (base) | Base image with adjustments and selections |
| `text-overlay.tsx`     | z-10       | Text layers with drag/delete               |
| `sticker-layer.tsx`    | z-20 (top) | Sticker layers with drag/resize            |

#### **Configuration Files**

| File                 | Purpose                        |
| -------------------- | ------------------------------ |
| `next.config.mjs`    | Next.js settings, build config |
| `tsconfig.json`      | TypeScript compiler options    |
| `tailwind.config.ts` | Tailwind CSS customization     |
| `components.json`    | Shadcn UI component config     |
| `postcss.config.mjs` | PostCSS plugins (Tailwind)     |

#### **Environment Variables** (`.env.local`)

```bash
# Required for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key

# Optional for authentication
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
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

## � Troubleshooting

### Text Layer Height Expansion Issue

**Symptom**: Image container grows when adding text or selecting text layer

**Status**: ✅ **FIXED**

**What was fixed**:

- Delete button positioning corrected (from outside to inside container)
- Container overflow protection added
- Image height now remains constant

**Verification**:

1. Upload an image to the editor
2. Click "Add Text" and add any text
3. Check image height - should **NOT change**
4. Click on the text to select it (delete button appears)
5. Check image height again - should **still NOT change**
6. Try 3D transforms - should work smoothly

**If still experiencing issues**:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (F5)
3. Check browser console (F12) for any errors
4. Verify all components loaded correctly

### 3D Perspective Transform Not Working

**Symptom**: Adjusting 3D perspective sliders has no visual effect

**Troubleshooting**:

1. Check if you clicked "Apply Transform" button (not just moved slider)
2. Open browser console (F12) and look for error messages
3. Verify image is loaded before applying transform
4. Try a different transform value (e.g., 45° instead of small values)
5. Ensure no text layers are causing layout issues

**Expected behavior**:

- Perspective Z: Image rotates like a page turning
- Perspective X: Image tilts forward/back
- Perspective Y: Image tilts left/right

### Reset Buttons Not Working

**Symptom**: Clicking Reset doesn't restore original image

**Troubleshooting**:

1. Ensure you applied changes before resetting (click "Apply" first)
2. Check browser console (F12) for logs starting with 🔄
3. Verify original file was properly uploaded
4. Try uploading image again

**Expected behavior**:

- All sliders return to 0
- Image returns to original appearance
- Console shows reset sequence logs

### Performance Issues

**Symptom**: Slow image editing, lag when adjusting sliders

**Troubleshooting**:

1. Reduce image size (use images under 5MB)
2. Close other browser tabs
3. Clear browser cache
4. Try different browser (Chrome/Firefox)
5. Check available system memory

**Optimization tips**:

- Use images 1920x1080 or smaller for best performance
- Avoid applying multiple transforms simultaneously
- Clear IndexedDB if storage is full

### Images Not Saving/Loading

**Symptom**: Can't save edited images or previously saved images don't load

**Troubleshooting**:

1. Check browser IndexedDB is enabled
2. Clear some browser storage space
3. Try incognito/private mode
4. Export as PNG/JPG instead of using browser storage

**How to export**:

1. After editing image
2. Right-click image
3. Select "Save image as..."
4. Choose location and format

---

## �🗺️ Roadmap

### 🎯 Current Focus

```

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
```
