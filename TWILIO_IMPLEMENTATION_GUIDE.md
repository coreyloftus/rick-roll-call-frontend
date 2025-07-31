# Twilio Implementation Guide

## Overview

This guide outlines the steps to implement Twilio calling functionality that:

1. Initiates a phone call to a user-provided number
2. Plays an audio file from Google Cloud Storage during the call
3. Automatically hangs up when the audio finishes

## Current State Analysis

From your existing codebase:

-   ✅ Frontend has a `TwilioBox` component with UI for phone number input and consent
-   ✅ You have a `twilioCall()` function stub in `src/app/api/twilioCalls.ts`
-   ✅ GCS upload is working and returns a `signed_url` for the audio file
-   ✅ Backend API endpoint structure is established (`http://127.0.0.1:8000`)

## Implementation Steps

### Step 1: Backend Twilio Setup

You'll need to implement the backend endpoint that your frontend `twilioCall()` function calls.

#### 1.1 Twilio Account Setup

-   [ ] Sign up for a Twilio account if you haven't already
-   [ ] Purchase a Twilio phone number (required for making outbound calls)
-   [ ] Get your Account SID and Auth Token from the Twilio Console
-   [ ] Add these credentials to your backend environment variables

#### 1.2 Backend Dependencies

-   [ ] Install Twilio SDK in your backend: `pip install twilio` (Python) or `npm install twilio` (Node.js)
-   [ ] Add any necessary CORS headers for the frontend-backend communication

#### 1.3 Create Twilio Call Endpoint

Create a backend endpoint at `/twilio/call` that:

-   [ ] Accepts `phoneNumber` and `audioUrl` from the request body
-   [ ] Uses Twilio SDK to initiate an outbound call
-   [ ] Sets up TwiML (Twilio Markup Language) to play the audio file
-   [ ] Returns success/failure response to frontend

**Key Twilio concepts you'll use:**

-   `client.calls.create()` - to initiate the call
-   TwiML `<Play>` verb - to play audio from a URL
-   TwiML `<Hangup>` verb - to end the call automatically

### Step 2: Frontend Integration

#### 2.1 Update TwilioBox Component

In `src/app/machine/components/TwilioBox.tsx`:

-   [ ] Import the `twilioCall` function from `@/app/api/twilioCalls`
-   [ ] Update the `handleAudioToTwilio()` function to:
    -   Call `twilioCall(phoneNumber, audioUrl)`
    -   Handle loading states (show spinner/disable button)
    -   Handle success/error responses
    -   Display appropriate user feedback

#### 2.2 Add State Management

-   [ ] Add loading state: `const [isCallInProgress, setIsCallInProgress] = useState(false)`
-   [ ] Add call status state: `const [callStatus, setCallStatus] = useState('')`
-   [ ] Update UI to show call progress and status

#### 2.3 Error Handling

-   [ ] Add try-catch blocks around the API call
-   [ ] Display user-friendly error messages
-   [ ] Validate phone number format before making the call

### Step 3: TwiML Configuration

#### 3.1 TwiML Structure

Your backend should generate TwiML that looks like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play>https://your-gcs-signed-url.com/audio.wav</Play>
    <Hangup/>
</Response>
```

#### 3.2 Audio Format Considerations

-   [ ] Ensure your GCS audio files are in a Twilio-compatible format
-   [ ] Twilio supports: MP3, WAV, GSM, μ-law, etc.
-   [ ] Consider converting to WAV or MP3 if needed
-   [ ] Test audio quality and duration

### Step 4: Advanced Implementation Options

#### 4.1 Real-time Call Status (Optional)

-   [ ] Use Twilio webhooks to get real-time call status updates
-   [ ] Create webhook endpoints for call events: `answered`, `completed`, `failed`
-   [ ] Update frontend UI based on call progress

#### 4.2 Call Recording (Optional)

-   [ ] Add TwiML `<Record>` verb if you want to record the call
-   [ ] Handle recorded audio files

#### 4.3 Enhanced Error Handling

-   [ ] Handle specific Twilio error codes
-   [ ] Implement retry logic for failed calls
-   [ ] Add call queuing if needed

### Step 5: Testing Strategy

#### 5.1 Development Testing

-   [ ] Use your own phone number for initial testing
-   [ ] Test with different audio file formats and durations
-   [ ] Verify the audio plays correctly during the call
-   [ ] Confirm the call hangs up automatically

#### 5.2 Edge Cases to Test

-   [ ] Invalid phone numbers
-   [ ] Network timeouts
-   [ ] Audio file access issues (expired signed URLs)
-   [ ] Busy/unreachable phone numbers
-   [ ] International phone number formats

### Step 6: Security Considerations

#### 6.1 Phone Number Validation

-   [ ] Implement server-side phone number validation
-   [ ] Consider rate limiting to prevent abuse
-   [ ] Log calls for monitoring purposes

#### 6.2 Audio URL Security

-   [ ] Ensure GCS signed URLs have appropriate expiration times
-   [ ] Validate that audio URLs are from your trusted GCS bucket
-   [ ] Consider adding authentication to your Twilio endpoint

### Step 7: Production Considerations

#### 7.1 Twilio Account Limits

-   [ ] Understand Twilio's rate limits and pricing
-   [ ] Set up billing alerts
-   [ ] Consider upgrading from trial account if needed

#### 7.2 Monitoring and Logging

-   [ ] Add comprehensive logging for debugging
-   [ ] Monitor call success rates
-   [ ] Set up alerts for failed calls

## Code Structure Overview

```
Backend:
├── /twilio/call (POST endpoint)
│   ├── Validate request
│   ├── Create Twilio call with TwiML
│   └── Return response

Frontend:
├── TwilioBox.tsx
│   ├── Updated handleAudioToTwilio()
│   ├── Loading states
│   └── Error handling
└── twilioCalls.ts (already exists)
    └── Make API call to backend
```

## Key Resources

-   [Twilio Programmable Voice Documentation](https://www.twilio.com/docs/voice)
-   [TwiML Voice Reference](https://www.twilio.com/docs/voice/twiml)
-   [Twilio Node.js Quickstart](https://www.twilio.com/docs/voice/quickstart/node)
-   [Twilio Python Quickstart](https://www.twilio.com/docs/voice/quickstart/python)

## Next Steps

1. Start with Step 1 (Backend Twilio Setup)
2. Implement the basic call functionality first
3. Test thoroughly with your own phone number
4. Add enhanced features and error handling
5. Consider the optional features based on your needs

Good luck with the implementation! The key is getting the basic TwiML flow working first, then adding the polish and
error handling.
