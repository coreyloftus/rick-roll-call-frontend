# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code)  
when working with code in this repository.

## Development Commands

-   `npm run dev` - Start development server on localhost:3000
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint

## Project Architecture

### Tech Stack

-   **Framework**: Next.js 15 with App Router and TypeScript
-   **UI**: Material-UI (MUI) + Tailwind CSS
-   **Backend Communication**: REST API calls to Python backend
-   **Audio Processing**: Google Gemini Text-to-Speech + Google Cloud Storage
-   **Phone Integration**: Twilio API (implementation in progress)

### Core Application Flow

1. **Text Input**: User enters text for audio generation
2. **Audio Generation**: Text converted to speech via Google Gemini API (`/gemini/audio`)
3. **Audio Preview**: Local blob URL creation for immediate playback
4. **Cloud Upload**: Audio uploaded to Google Cloud Storage (`/gcs/upload`)
5. **Phone Call**: Twilio integration to deliver audio via phone call

### Key Components Structure

**Main Page Flow** (`src/app/page.tsx`):

-   Performs backend sanity check on load
-   Displays status indicator (green/red dot)
-   Contains CardBox for step-by-step UI

**CardBox Component** (`src/app/components/CardBox.tsx`):

-   Multi-step wizard interface with Previous/Next navigation
-   Step 1: Audio generation (`GenAudioBox`)
-   Step 2: Phone call setup (`TwilioBox`)
-   Step 3: Call status (placeholder)

**GenAudioBox Component**:

-   Text input for speech generation
-   Audio preview with AudioPlayer component
-   Upload confirmation to GCS
-   Sets `publicAudioUrl` for next step

**TwilioBox Component**:

-   Phone number input with validation
-   Terms and conditions consent UI
-   Call status monitoring with 3-second polling
-   Real-time status display for call progress

### API Integration

**Backend Endpoints** (configured via `.env`):

-   Development: `http://127.0.0.1:8000`
-   Production: `https://rick-roll-call-backend-155276398322.northamerica-northeast2.run.app`

**API Functions** (`src/app/api/googleCalls.ts`):

-   `backendSanityCheck()` - Health check
-   `geminiAudio(text)` - Generate audio from text
-   `gcsFileUpload(file)` - Upload to Google Cloud Storage

**API Functions** (`src/app/api/twilioCalls.ts`):

-   `twilioCall()` - Initiate phone call (implementation needed)
-   `getTwilioStatus()` - Check Twilio service status
-   `getTwilioCallStatus()` - Poll individual call status

### State Management Patterns

-   Local component state with useState
-   Cross-component communication via prop drilling
-   Audio URL sharing between GenAudioBox and TwilioBox
-   Real-time call status updates via useEffect polling

### Implementation Status

-   ✅ Audio generation and preview working
-   ✅ GCS upload integration complete
-   ✅ Frontend UI components implemented
-   ⚠️ Twilio backend integration incomplete (see TWILIO_IMPLEMENTATION_GUIDE.md)
-   ⚠️ Environment variables need proper Next.js prefix (NEXT*PUBLIC*)

### Key Files to Understand

-   `src/app/components/CardBox.tsx` - Main UI flow orchestration
-   `src/app/api/googleCalls.ts` - Google services integration
-   `src/app/api/twilioCalls.ts` - Twilio integration stubs
-   `TWILIO_IMPLEMENTATION_GUIDE.md` - Detailed Twilio implementation roadmap

### Development Notes

-   Backend expects CORS headers for cross-origin requests
-   Audio files are processed as blobs and converted to File objects for upload
-   Phone number validation uses regex pattern for international formats
-   Real-time features use polling rather than WebSockets
