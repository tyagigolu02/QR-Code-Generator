# 🔳 QR Code Generator

![Banner](https://img.shields.io/badge/QR%20Code-Generator-blue?style=for-the-badge&logo=qrcode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Create beautiful custom QR codes in seconds! Generate, customize, and download QR codes for URLs, text, contact info, Wi-Fi details, and more.

![QR Code Demo](https://via.placeholder.com/800x400?text=QR+Code+Generator+Demo)

## ✨ Features

- 📱 Generate QR codes for various data types:
  - Website URLs
  - Plain text
  - Contact information (vCard)
  - Wi-Fi network credentials
  - Location coordinates
  - Email addresses
  - Phone numbers
  
- 🎨 Customize your QR codes:
  - Change colors (foreground and background)
  - Add custom logos
  - Adjust size and error correction levels
  - Choose between different styles and patterns
  
- 💾 Multiple export formats:
  - PNG (with transparency)
  - SVG (scalable)
  - PDF
  - JPEG
  
- 🚀 Additional features:
  - Batch generation
  - Real-time preview
  - Error handling and validation
  - Mobile-friendly interface

## 🚀 Live Demo

Check out the live demo: [QR Code Generator](https://your-demo-url.com)

## 📋 Requirements

- Node.js (v14.0.0 or higher)
- npm or yarn

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/tyagigolu02/qr-code-generator.git

# Navigate to the project directory
cd qr-code-generator

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm start
# or
yarn start
```

## 🖥️ Usage

### Basic Usage

```javascript
import { generateQRCode } from './qrCodeGenerator';

// Generate a simple URL QR code
const qrCode = generateQRCode({
  data: 'https://github.com/tyagigolu02',
  width: 256,
  height: 256
});

// Save to file
qrCode.toFile('my-qr-code.png');
```

### Advanced Usage

```javascript
// Generate a customized QR code
const customQR = generateQRCode({
  data: 'https://github.com/tyagigolu02',
  width: 300,
  height: 300,
  color: {
    dark: '#010599FF',
    light: '#FFBF60FF'
  },
  errorCorrectionLevel: 'H',
  margin: 1,
  logoImage: 'path/to/logo.png',
  logoWidth: 60,
  logoHeight: 60
});
```

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/250x250?text=Simple+QR" alt="Simple QR" width="200"/>
  <img src="https://via.placeholder.com/250x250?text=Custom+QR" alt="Custom QR" width="200"/>
  <img src="https://via.placeholder.com/250x250?text=Logo+QR" alt="QR with Logo" width="200"/>
</div>

## 📚 API Documentation

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `data` | String | Content to encode in the QR code | Required |
| `width` | Number | Width of the QR code in pixels | 256 |
| `height` | Number | Height of the QR code in pixels | 256 |
| `color.dark` | String | Color of the dark modules | '#000000ff' |
| `color.light` | String | Color of the light modules | '#ffffffff' |
| `errorCorrectionLevel` | String | Error correction level (L, M, Q, H) | 'M' |
| `margin` | Number | Margin around the QR code | 4 |
| `logoImage` | String | Path to logo image | null |
| `logoWidth` | Number | Width of the logo | 0 |
| `logoHeight` | Number | Height of the logo | 0 |

## 🛠️ Tech Stack

- Frontend: React.js, HTML5, CSS3
- QR Code Generation: qrcode.js
- Image Processing: canvas-api
- Styling: Tailwind CSS
- Build Tool: Vite

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Golu Tyagi (@tyagigolu02)**

- GitHub: [tyagigolu02](https://github.com/tyagigolu02)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

## 🙏 Acknowledgements

- [qrcode.js](https://github.com/soldair/node-qrcode) for the core QR code generation
- All contributors who have helped with features and bug fixes
- The open-source community for continuous inspiration

---

<p align="center">Made with ❤️ by <a href="https://github.com/tyagigolu02">Golu Tyagi</a></p>
