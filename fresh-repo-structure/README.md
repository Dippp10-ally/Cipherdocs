# CipherDocs - Secure Document Sharing Platform

A modern, secure document sharing platform built with React, TypeScript, and blockchain technology. Designed specifically for secure document transactions in Pune, Maharashtra.

## 🚀 Features

- **Unified Sharing Interface**: Single interface for all sharing methods (ID, QR, Email, Phone)
- **Secure Document Viewing**: Time-limited access with professional security measures
- **IPFS Storage**: Decentralized document storage with Pinata gateway
- **Blockchain Security**: Algorand blockchain for immutable access records
- **Professional UI**: Clean, emoji-free interface suitable for business use
- **Responsive Design**: Works seamlessly on all devices

## 🏗️ Architecture

- **Frontend**: React 18+ with TypeScript and Tailwind CSS
- **Storage**: IPFS with Pinata gateway integration
- **Blockchain**: Algorand for secure transactions
- **Location**: Pune, Maharashtra focused functionality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── core/           # Essential components (Navbar, Footer, etc.)
│   ├── document/       # Document handling components
│   └── ui/             # Basic UI elements
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── UnifiedSharingPage.tsx  # Document sharing interface
│   └── ReceiverPage.tsx # Document viewing interface
├── services/           # External service integrations
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cipherdocs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
REACT_APP_ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
REACT_APP_LOCATION=Pune, Maharashtra
```

## 🌐 Core Functionality

### Document Sharing Workflow

1. **Choose Sharing Method**: Select from ID, QR, Email, or Phone
2. **Enter Recipient Details**: Provide recipient information
3. **Upload Documents**: Secure upload to IPFS
4. **Set Permissions**: Configure access rights and time limits
5. **Share Securely**: Generate secure access for recipient

### Document Viewing

1. **Authenticate**: Enter email, phone, or CipherDocs ID
2. **View Documents**: Time-limited secure viewing
3. **Print Capability**: Secure printing with audit logs

## 🔒 Security Features

- Time-limited document access
- IPFS decentralized storage
- Blockchain audit trails
- Professional security measures
- No save-as-PDF prevention for sensitive documents

## 🏢 Business Features

- Professional appearance (no emojis)
- Pune, Maharashtra location specificity
- Business-grade security
- Clean, modern interface
- Mobile responsive design

## 📱 Technology Stack

- **React 18+** - Modern web framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hot Toast** - User notifications

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Your own server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏙️ Location

This application is specifically designed for document sharing needs in **Pune, Maharashtra, India**.

## 📞 Support

For support, please contact our team or create an issue in this repository.

---

**CipherDocs** - Secure Document Sharing for the Digital Age