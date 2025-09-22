# 🎥 Video to 3D Scene

A modern web application for reconstructing 3D scenes from videos using simulated NeRF and Gaussian Splatting workflows. This template demonstrates keyframe extraction, camera path visualization, and 3D scene export capabilities.

## ✨ Features

- **Video Player with Keyframe Markers**: Interactive video player with visual keyframe indicators
- **3D Scene Viewer**: Real-time 3D scene visualization using React Three Fiber
- **Camera Path Visualization**: Toggle camera trajectory overlay in 3D space
- **Export Functionality**: Export GLB models and camera path JSON data
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Mock Data Integration**: Pre-configured with sample data for demonstration

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── VideoPlayer.tsx    # Video player with keyframes
│   ├── SceneViewer.tsx    # 3D scene viewer
│   └── ExportPanel.tsx    # Export functionality
├── lib/                   # Utility functions
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type definitions
├── public/                # Static assets
│   ├── mock/              # Mock data files
│   └── sample/            # Sample video files
└── manifest.json          # Project configuration
```

## 🎯 Key Capabilities

### Video Processing
- Upload and play video files
- Extract keyframes automatically
- Visual keyframe markers on timeline
- Interactive video scrubbing

### 3D Scene Reconstruction
- Simulated NeRF/Gaussian Splatting workflow
- Real-time 3D scene visualization
- Camera path reconstruction
- Volumetric scene representation

### Export Options
- **GLB Export**: 3D scene models for Blender, Unity, etc.
- **Camera Path JSON**: Camera trajectory data
- **Batch Export**: Export all assets at once

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: React Three Fiber, Three.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Video**: HTML5 Video API

## 📋 Environment Variables

```env
NEXT_PUBLIC_LV_API_URL=https://api.latentvision.com
NEXT_PUBLIC_LV_API_KEY=your_api_key_here
NEXT_PUBLIC_STORAGE_BUCKET=latentvision-storage
```

## 🎨 UI Components

### Video Player
- Custom video controls
- Keyframe markers overlay
- Timeline scrubbing
- Volume controls

### 3D Scene Viewer
- Interactive 3D scene
- Camera path visualization
- Orbit controls
- Environment lighting

### Export Panel
- GLB file export
- Camera path JSON export
- Batch export options
- Export status indicators

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in `/components`
2. Add types in `/types/index.ts`
3. Update main page in `/app/page.tsx`
4. Add styles in `/app/globals.css`

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes

## 🎯 Use Cases

- **Product Previews**: Create 3D models from product videos
- **AR Content**: Generate AR-ready 3D scenes
- **Scene Walkthroughs**: Convert video tours to interactive 3D
- **Volumetric Capture**: Simulate advanced 3D capture workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Three Fiber for 3D graphics
- Next.js for the framework
- Tailwind CSS for styling
- Lucide for icons