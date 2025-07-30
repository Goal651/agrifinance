# AgriFinance Project Index

## 📋 Project Overview

**AgriFinance** is a React Native/Expo mobile application designed for agricultural financial services. The app provides loan management, project tracking, and financial analytics for agricultural businesses.

## 🏗️ Project Structure

### Root Directory
```
agrifinance/
├── app/                    # Main application screens (Expo Router)
├── api/                    # API integration layer
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
├── constants/              # App constants and configuration
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── scripts/                # Utility scripts
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── [config files]          # Various configuration files
```

## 📱 Application Screens

### Main App (`app/`)
- **`_layout.tsx`** - Root layout configuration
- **`index.tsx`** - Landing/home screen
- **`+not-found.tsx`** - 404 error page

### Tab Navigation (`app/(tabs)/`)
- **`_layout.tsx`** - Tab navigation layout
- **`index.tsx`** - Dashboard/home tab
- **`loan-services.tsx`** - Loan services overview
- **`LoanApplication.tsx`** - Enhanced loan application with personal info, financial info & document upload (6-step process)
- **`LoanAnalytics.tsx`** - Loan analytics and reports
- **`LoanHistory.tsx`** - Loan history and records
- **`LoanPayments.tsx`** - Payment management
- **`project-services.tsx`** - Project services overview
- **`NewProject.tsx`** - New project creation
- **`ProjectAnalytics.tsx`** - Project analytics and reports

### Admin Screens (`app/`)
- **`admin-dashboard.tsx`** - Admin dashboard
- **`admin-login.tsx`** - Admin authentication
- **`admin-loans.tsx`** - Loan management for admins
- **`admin-project.tsx`** - Project management for admins
- **`admin-users.tsx`** - User management for admins

### Components (`app/components/`)
- **`UserTable.tsx`** - Reusable user table component

## 🔌 API Layer (`api/`)

### Core API Files
- **`index.ts`** - API exports
- **`client.ts`** - HTTP client configuration (213 lines)
- **`constants.ts`** - API constants and endpoints (73 lines)

### Feature-specific APIs
- **`auth.ts`** - Authentication API calls
- **`loan.ts`** - Loan-related API operations
- **`payment.ts`** - Payment processing API
- **`project.ts`** - Project management API
- **`user.ts`** - User management API

## 🎨 UI Components (`components/`)

### Core Components
- **`Collapsible.tsx`** - Collapsible content component
- **`ExternalLink.tsx`** - External link handling
- **`HapticTab.tsx`** - Haptic feedback tab component
- **`HelloWave.tsx`** - Wave animation component
- **`ParallaxScrollView.tsx`** - Parallax scrolling effect
- **`ThemedText.tsx`** - Themed text component
- **`ThemedView.tsx`** - Themed view component

### UI System (`components/ui/`)
- **`IconSymbol.ios.tsx`** - iOS-specific icon symbols
- **`IconSymbol.tsx`** - Cross-platform icon symbols
- **`TabBarBackground.ios.tsx`** - iOS tab bar background
- **`TabBarBackground.tsx`** - Cross-platform tab bar background

## 🎯 Custom Hooks (`hooks/`)

- **`useAuth.ts`** - Authentication state management
- **`useColorScheme.ts`** - Color scheme management
- **`useColorScheme.web.ts`** - Web-specific color scheme
- **`useLoan.ts`** - Loan data and operations
- **`usePayment.ts`** - Payment operations
- **`useProject.ts`** - Project data and operations
- **`useThemeColor.ts`** - Theme color utilities
- **`useUser.ts`** - User data management

## 📊 Type Definitions (`types/`)

- **`index.ts`** - Main type exports
- **`api.ts`** - API response types
- **`auth.ts`** - Authentication types
- **`loan.ts`** - Loan-related types including PersonalInfo, FinancialInfo and DocumentUpload interfaces (82 lines)
- **`project.ts`** - Project-related types (54 lines)
- **`user.ts`** - User-related types

## 🎨 Styling & Configuration

### Styling
- **`global.css`** - Global CSS styles
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`nativewind-env.d.ts`** - NativeWind TypeScript definitions

### Configuration Files
- **`app.json`** - Expo app configuration
- **`babel.config.js`** - Babel configuration
- **`eslint.config.js`** - ESLint configuration
- **`metro.config.js`** - Metro bundler configuration
- **`tsconfig.json`** - TypeScript configuration

## 🚀 Scripts & Utilities

### Scripts (`scripts/`)
- **`reset-project.js`** - Project reset utility

### Utils (`utils/`)
- **`loan.ts`** - Loan-related utility functions

## 📦 Dependencies

### Core Framework
- **Expo SDK 53** - React Native development platform
- **React 19** - UI library
- **React Native 0.79.5** - Mobile framework

### Navigation
- **Expo Router** - File-based routing
- **React Navigation** - Navigation library

### UI & Styling
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - Animation library
- **Expo Vector Icons** - Icon library

### Data & State
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **React Native Toast Message** - Toast notifications
- **Expo Image Picker** - Image/document upload functionality

### Development
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🎯 Key Features

### User Features
- **Enhanced Loan Application** - 6-step application process with personal information, financial information and document upload
- **Personal Information Collection** - Name, ID number, address, date of birth
- **Financial Information Collection** - Income details, employment status, bank account information
- **Document Upload System** - ID photos, proof of income, farm ownership documents, cooperative membership, tree images (max 15)
- **Loan Management** - Apply for, track, and manage agricultural loans
- **Project Tracking** - Create and monitor agricultural projects
- **Payment Processing** - Handle loan payments and transactions
- **Analytics Dashboard** - View financial analytics and reports
- **User Profile** - Manage personal information and preferences

### Admin Features
- **User Management** - Administer user accounts and permissions
- **Loan Administration** - Review and approve loan applications
- **Project Oversight** - Monitor and manage agricultural projects
- **Analytics & Reporting** - Comprehensive financial reporting

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Lint code
npm run lint

# Reset project (development)
npm run reset-project
```

## 📱 Platform Support

- **iOS** - Native iOS app
- **Android** - Native Android app
- **Web** - Progressive web app
- **Development Builds** - Custom development builds

## 🔧 Development Setup

1. **Prerequisites**
   - Node.js
   - npm or yarn
   - Expo CLI
   - iOS Simulator (for iOS development)
   - Android Studio (for Android development)

2. **Installation**
   ```bash
   git clone [repository-url]
   cd agrifinance
   npm install
   ```

3. **Running the App**
   ```bash
   npm start
   ```

## 📄 File Organization

The project follows a feature-based organization:
- **Screens** are organized by functionality (loans, projects, admin)
- **Components** are reusable across the application
- **API layer** is separated by domain (auth, loans, projects)
- **Types** are organized by feature domain
- **Hooks** provide custom logic for specific features

## 🔐 Security & Authentication

- JWT-based authentication
- Secure API communication
- Role-based access control (User/Admin)
- Local storage for session management

## 📊 Data Flow

1. **API Layer** - Handles all external communication
2. **Hooks** - Provide data and operations to components
3. **Contexts** - Manage global state (auth, theme)
4. **Components** - Render UI based on data and state
5. **Screens** - Orchestrate components and handle navigation

This index provides a comprehensive overview of the AgriFinance project structure, making it easy for developers to understand and navigate the codebase. 