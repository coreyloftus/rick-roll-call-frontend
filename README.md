# Rick Roll Call Frontend 🎵📞

A fun AI-powered prank calling application that generates audio messages using Google Gemini's text-to-speech capabilities and delivers them via Twilio phone calls. Perfect for harmless pranks and entertainment!

## 🚀 Features

-   **AI Text-to-Speech**: Convert text to realistic audio using Google Gemini's advanced TTS
-   **Audio Player**: Preview generated audio before sending
-   **Cloud Storage**: Upload and manage audio files via Google Cloud Storage
-   **Twilio Integration**: Make phone calls with your generated audio messages
-   **Modern UI**: Clean, responsive interface built with Material-UI and Tailwind CSS
-   **Dark Mode Support**: Automatic dark/light theme detection
-   **Real-time Preview**: Listen to generated audio instantly

## 📦 Installation

### Prerequisites

-   Node.js 18+ and npm
-   A running backend server (see backend repository)
-   Google Cloud Platform account with Speech API enabled
-   Twilio account for phone call functionality

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/coreyloftus/rick-roll-call-frontend.git
    cd rick-roll-call-frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint

## 🎯 How It Works

1. **Text Input**: Enter the message you want to convert to speech
2. **AI Generation**: Google Gemini converts your text to natural-sounding audio
3. **Audio Preview**: Listen to the generated audio using the built-in player
4. **Cloud Upload**: Upload the audio to Google Cloud Storage for persistence
5. **Phone Call**: Use Twilio integration to call any phone number with your audio message

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 with App Router
-   **UI Library**: Material-UI (MUI) + Tailwind CSS
-   **Language**: TypeScript
-   **Audio Processing**: Web Audio API
-   **Cloud Services**: Google Cloud Storage, Google Gemini API
-   **Communication**: Twilio API
-   **Styling**: Tailwind CSS with custom MUI theming

## 📋 TODO List

### High Priority

-   [ ] Complete Twilio integration with phone number input and actual calling functionality
-   [ ] Add environment variables configuration and documentation
-   [ ] Implement proper error handling and user feedback throughout the app
-   [ ] Update package.json name from "answering-machine-frontend" to "rick-roll-call-frontend"
-   [ ] Add input validation and sanitization for text inputs

### Medium Priority

-   [ ] Fix duplicate text in about component
-   [ ] Add loading states and progress indicators for API calls
-   [ ] Implement audio file format selection (MP3, WAV, etc.)
-   [ ] Add voice selection options (different AI voices)
-   [ ] Create user authentication and session management
-   [ ] Add call history and audio library features

### Low Priority

-   [ ] Add unit and integration tests
-   [ ] Implement audio editing capabilities (trim, volume adjustment)
-   [ ] Add social sharing features for generated audio
-   [ ] Create mobile-responsive optimizations
-   [ ] Add internationalization (i18n) support
-   [ ] Implement analytics and usage tracking

### Infrastructure

-   [ ] Set up CI/CD pipeline
-   [ ] Add Docker containerization
-   [ ] Create deployment documentation
-   [ ] Add monitoring and logging
-   [ ] Implement rate limiting and security measures

## 🔧 Configuration

The app expects a backend server running on `http://127.0.0.1:8000` by default. Make sure to:

1. Set up the corresponding backend server
2. Configure Google Cloud credentials
3. Set up Twilio account and phone numbers
4. Update API endpoints if using different URLs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Contact

**Corey Loftus**

-   GitHub: [@coreyloftus](https://github.com/coreyloftus)
-   Email: [Your email here]
-   LinkedIn: [Your LinkedIn here]

## 📄 License

This project is for educational and entertainment purposes. Please use responsibly and ensure you have consent before making prank calls to others.

---

_Built with ❤️ for harmless fun and learning_
