# Google Maps Direction Finder

A modern, responsive React application that helps users find optimal routes between any two locations using Google Maps API. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Interactive Google Maps Integration**: Full-featured map with zoom, pan, and street view controls
- **Multiple Travel Modes**: Support for driving, walking, cycling, transit, and two-wheeler routes
- **Real-time Route Calculation**: Get accurate distance and duration estimates
- **Location Autocomplete**: Smart location search with Google Places API
- **Fixed Location Support**: Quick access to predefined current location
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with loading states and error handling
- **Production Ready**: Optimized build with code splitting and performance enhancements

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API, React Google Maps API
- **Icons**: React Icons (Font Awesome)
- **Notifications**: React Toastify
- **Build Tool**: Vite with optimized production build

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- Google Maps API Key with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Directions API

## 🚀 Quick Start

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/munna6124ssa/Google_Map_Direction.git
cd Google_Map_Direction
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a \`.env\` file in the root directory:
\`\`\`env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
\`\`\`

### 4. Development
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\`

### 5. Production Build
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🌐 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Configure build settings:
   - **Build Command**: \`npm install && npm run build\`
   - **Publish Directory**: \`dist\`
   - **Start Command**: \`npm run start\`
3. Add environment variable: \`VITE_GOOGLE_MAPS_API_KEY\`

### Other Platforms
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| \`VITE_GOOGLE_MAPS_API_KEY\` | Your Google Maps API key | Yes |

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
4. Create API credentials (API Key)
5. Restrict the API key (recommended for production)

## 📱 Features in Detail

### Route Calculation
- Enter origin and destination addresses
- Select from multiple travel modes
- View detailed route on map
- Get distance and time estimates

### Travel Modes
- 🚗 **Driving**: Optimal routes for cars
- 🚶 **Walking**: Pedestrian-friendly paths
- 🚴 **Bicycling**: Bike-friendly routes
- 🚌 **Transit**: Public transportation options
- 🏍️ **Two-Wheeler**: Motorcycle/scooter routes

### User Experience
- Autocomplete address suggestions
- One-click current location setting
- Expandable/collapsible control panel
- Loading states and error handling
- Toast notifications for user feedback

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic vendor and feature-based chunks
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Compressed and properly sized assets
- **Minification**: JavaScript and CSS minification
- **Tree Shaking**: Unused code elimination
- **Caching**: Browser caching strategies

## 🔒 Security Features

- Environment variables for sensitive data
- API key validation
- Error boundary implementation
- Input sanitization
- HTTPS enforcement (in production)

## 🐛 Troubleshooting

### Common Issues
1. **API Key Not Working**: Ensure all required APIs are enabled
2. **Routes Not Loading**: Check API quotas and billing
3. **Build Errors**: Verify Node.js version compatibility

### Error Messages
- **Configuration Error**: Missing environment variables
- **Map Loading Error**: API key or network issues
- **Route Calculation Failed**: Invalid locations or API limits

## 📈 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Munna Kumar**
- GitHub: [@munna6124ssa](https://github.com/munna6124ssa)

## 🙏 Acknowledgments

- Google Maps Platform for comprehensive mapping APIs
- React Google Maps API for seamless React integration
- Tailwind CSS for utility-first styling
- Vite for fast build tooling

---

⭐ Star this repository if you find it helpful!
