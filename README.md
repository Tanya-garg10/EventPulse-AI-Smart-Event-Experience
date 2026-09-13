<div align="center">
  <h1>🎯 EventPulse OS</h1>
  <p><i>Your event, alive. Powered by Google Gemini & Deterministic Dijkstra.</i></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

# EventPulse OS

EventPulse OS is a next-generation event management platform that transforms traditional conferences into intelligent, responsive experiences. It combines real-time crowd monitoring, AI-powered assistance, and dynamic navigation to create a seamless event experience for attendees and organizers.

## ✨ Features

### 🎯 Core Capabilities
- **Real-time Venue Monitoring**: Live crowd density tracking across all event zones with trend analysis
- **AI Concierge Service**: Intelligent assistance powered by Google Gemini for personalized recommendations
- **Interactive Venue Maps**: Dynamic floor plans with real-time occupancy data and accessibility information
- **Smart Scheduling**: Personalized event schedules with conflict detection and recommendations
- **Crowd Intelligence**: Predictive crowd flow analysis and alternative route suggestions

### 🚨 Safety & Accessibility
- **Emergency SOS System**: One-tap emergency response with location sharing
- **Accessibility Mode**: WCAG AA compliant interface with screen reader support
- **Assistance Mode**: Full-screen emergency console for critical situations
- **Medical & Security Integration**: Real-time location of first aid and security posts

### 🎪 Event Management
- **Organizer Dashboard**: Real-time metrics, capacity management, and announcements
- **Live Announcements**: Targeted notifications based on attendee location and preferences
- **Zone Management**: Dynamic capacity control and crowd flow optimization
- **Multi-role Support**: Different interfaces for attendees, VIPs, and organizers

### 🤖 AI-Powered Features
- **Intelligent Recommendations**: Session suggestions based on interests and schedule
- **Natural Language Queries**: Ask questions about the event in plain language
- **Context-Aware Assistance**: AI that understands your current location and schedule
- **Predictive Analytics**: Anticipate crowd bottlenecks and suggest alternatives

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization

### Backend & AI
- **Express** - Node.js web server
- **Google Gemini API** - AI-powered features
- **TypeScript** - End-to-end type safety

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **esbuild** - Fast bundling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventpulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
eventpulse/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── layout/          # Layout components (Header, Nav, etc.)
│   │   ├── modals/          # Modal dialogs
│   │   └── views/           # Main view components
│   ├── context/             # React context providers
│   ├── data/                # Static event data
│   ├── services/            # Business logic & API calls
│   │   ├── ai/             # AI-powered services
│   │   ├── crowd/          # Crowd monitoring
│   │   ├── emergency/      # Emergency systems
│   │   ├── navigation/     # Routing & navigation
│   │   └── recommendations/ # Recommendation engine
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── server.ts                # Express server
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🏗 Architecture

### Component Architecture
- **Context-based State Management**: EventContext provides global state management
- **View-based Routing**: Dynamic view switching without traditional routing
- **Service Layer**: Business logic separated from UI components
- **Modal System**: Persistent global modals for critical features

### Key Services
- **ConciergeService**: AI-powered question answering and recommendations
- **CrowdService**: Real-time crowd monitoring and analysis
- **EmergencyService**: SOS handling and emergency response
- **RoutingService**: Dijkstra-based pathfinding with accessibility constraints
- **RecommendationEngine**: Personalized content suggestions

### Data Flow
1. User interactions update context state
2. Services process business logic
3. Components re-render based on state changes
4. AI services provide intelligent insights
5. Real-time updates propagate through the application

## 🎨 Design Philosophy

EventPulse OS follows a futuristic, minimal design language:
- **Dark Theme**: Optimized for battery life and readability
- **High Contrast**: WCAG AA compliant color contrasts
- **Motion Design**: Subtle animations that enhance usability
- **Responsive Design**: Seamless experience across all devices
- **Accessibility First**: Screen reader support and keyboard navigation

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY`: Required for AI-powered features
- `PORT`: Server port (default: 3000)

### Customization
- Event data can be modified in `src/data/eventData.ts`
- Styling is handled through Tailwind CSS classes
- Component behavior can be customized via props and context

## 📱 Features by Role

### Attendees
- Personalized schedules and recommendations
- Real-time venue navigation
- AI-powered event assistance
- Emergency support and accessibility features

### Organizers
- Real-time crowd monitoring
- Capacity management
- Live announcements
- Emergency response coordination

### VIPs
- Priority navigation routes
- Exclusive networking opportunities
- Personalized concierge service

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the Apache 2.0 License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

<div align="center">
  <p>Built with ❤️</p>
  <p>Powered by <a href="https://ai.google.dev/">Google Gemini</a> & Modern Web Technologies</p>
</div>
