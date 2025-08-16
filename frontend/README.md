# ICPerfect - Frontend Prototype

A frontend-only prototype of ICPerfect, an AI-powered sales intelligence platform. This version includes all UI components and user flows but operates with mock data instead of real backend API calls.

## Features

✅ **Frontend-Only Implementation**
- Mock authentication system (no real backend required)
- Complete UI/UX for sales intelligence workflows
- Interactive dashboard with sample data
- Onboarding flow and user management interface
- All components work with local storage and mock data

🎯 **Core Functionality (Prototype)**
- User registration and login (mock authentication)
- Company onboarding process
- Sales dashboard with analytics
- Lead management interface
- ICP (Ideal Customer Profile) analysis
- AI engine simulation
- Multi-channel outreach orchestration

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ictperfect-tool2-35adabed
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Demo Account
Since this is a frontend-only prototype, you can use any email and password combination to log in. The system will create a mock user session that persists in your browser's local storage.

### Sample Workflow
1. **Register/Login**: Use any credentials to create a mock account
2. **Onboarding**: Complete the company setup process
3. **Dashboard**: Explore the sales intelligence interface with sample data
4. **Features**: Navigate through different tabs to see lead management, ICP analysis, and AI tools

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router v6
- **State Management**: React Context + hooks
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, cards, etc.)
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── OnboardingForm.tsx
│   └── ...
├── pages/               # Route components
│   ├── Index.tsx        # Main dashboard page
│   ├── Login.tsx        # Authentication pages
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Mock authentication
│   └── ...
└── lib/                 # Utility functions
```

## Development Notes

This is a **prototype version** designed to demonstrate the user interface and user experience of ICPerfect without requiring backend infrastructure. All data is mocked and stored locally in the browser.

### What's Included:
- Complete UI implementation
- Mock authentication system
- Sample data for all features
- Responsive design
- Interactive components

### What's NOT Included:
- Real API integrations
- Database connections
- Email sending functionality
- Payment processing
- Real AI/ML integrations

## Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## License

This project is part of a prototype demonstration.
