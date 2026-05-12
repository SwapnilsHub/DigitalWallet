# Digital Wallet Frontend

A modern, premium digital wallet web application built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Features

- 🔐 JWT Authentication (Login/Register)
- 💰 Wallet Dashboard with balance overview
- ➕ Add Money functionality
- 💸 Send Money to other users
- 📊 Transaction History with filtering
- 👤 Profile & Settings management
- 🎨 Modern glassmorphism UI with neon accents
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions
- 🔔 Toast notifications

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Loader.jsx
│   ├── Card.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── AddMoneyPage.jsx
│   ├── SendMoneyPage.jsx
│   ├── TransactionHistoryPage.jsx
│   └── ProfilePage.jsx
├── layouts/            # Layout components
│   └── DashboardLayout.jsx
├── context/            # React Context
│   └── AuthContext.jsx
├── services/           # API services
│   └── api.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8088/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Backend Integration

The frontend is designed to work with a Spring Boot backend. Make sure your backend is running on the configured API URL.

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Wallet:**
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add` - Add money to wallet
- `POST /api/wallet/send` - Send money to another user

**Transactions:**
- `GET /api/transactions` - Get all transactions

### Request Format

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Features Breakdown

### Authentication Flow
- JWT token stored in localStorage
- Automatic token attachment to API requests
- Protected routes with automatic redirect to login
- Logout functionality with token cleanup

### Dashboard
- Current balance display with neon glow effect
- Total credited/debited statistics
- Transaction count
- Recent transactions list
- Quick action buttons
- Account status cards

### Add Money
- Enter amount with validation
- Quick amount selection buttons
- Transaction limits display
- Instant processing with toast notifications

### Send Money
- Receiver username input
- Balance validation
- Confirmation modal before sending
- Transaction limits display
- Error handling for insufficient funds

### Transaction History
- Full transaction list with filtering
- Search by username
- Filter by transaction type (Credit/Debit)
- Transaction statistics cards
- Responsive table layout

### Profile
- User information display
- Account security settings
- Preference toggles
- Logout functionality

## UI/UX Features

- **Glassmorphism Design** - Frosted glass effect on cards
- **Neon Accents** - Cyan and purple neon highlights
- **Smooth Animations** - Framer Motion transitions
- **Hover Effects** - Interactive button and card animations
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Premium dark mode aesthetic
- **Toast Notifications** - Real-time feedback

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

## Author

Built for Final Year Project - Digital Wallet Backend
