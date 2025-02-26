# Live Translation Video Platform

A video calling app with AI-powered live translation capabilities. This platform enables real-time communication across language barriers by providing instant audio translation during video calls.

## Overview

This application provides a complete video calling solution with built-in translation features:

- Real-time video communication using Daily.co's robust tooling
- Instant audio translation powered by Cerebrium's AI infrastructure
- Seamless device management and language selection

## Features

- 🎥 High-quality video calls with crystal clear audio
- 🗣️ Real-time speech translation across multiple languages
- 🔧 Intuitive device setup and testing
- 🌍 Support for 3 languages
- 🔒 Secure, token-based room access
- 📱 Responsive design for all devices

## Prerequisites

Before running this application, ensure you have:

- Node.js 18.0.0 or higher
- A Daily.co account with API credentials
- A Cerebrium account for AI translation services
- Environment variables configured

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/CerebriumAI/example-live-translation.git
cd example-live-translation
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:

Create a `.env.local` file:

```
NEXT_PUBLIC_DAILY_SUBDOMAIN=your_daily_subdomain
DAILY_API_KEY=your_daily_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Room Creation and Management

The platform uses Daily.co's API for room management:

- Rooms are created with secure tokens
- Each room has a unique URL
- Participants can join with a name and language preference
- Room access is controlled via token-based authentication

## Translation Service

The translation feature is powered by Cerebrium's AI infrastructure:

- Real-time audio processing
- Support for multiple languages
- Low-latency translation delivery
- High accuracy across different accents and speaking styles