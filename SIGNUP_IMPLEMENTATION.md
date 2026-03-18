# Signup API Implementation Guide

## Overview
The signup feature has been fully implemented with form validation, API integration, and TanStack Query state management.

## Files Created/Modified

### 1. **Type Definitions** - [src/types/auth.ts](src/types/auth.ts)
Contains interfaces for:
- `SignupRequest`: Full name, email, password
- `UserSchema`: User response data
- `SuccessResponse<T>`: Generic success response wrapper
- `ErrorResponse`: Error response interface

### 2. **Validation Schema** - [src/lib/validations.ts](src/lib/validations.ts)
- Uses **Zod** for runtime validation
- `full_name`: 2-100 characters minimum
- `email`: Valid email format
- `password`: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### 3. **API Service** - [src/lib/api.ts](src/lib/api.ts)
- Axios instance with `NEXT_PUBLIC_BACKEND_URL` configuration
- `authAPI.signup()` function for the `/auth/signup` endpoint

### 4. **Custom Hook** - [src/hooks/useSignup.ts](src/hooks/useSignup.ts)
- TanStack Query `useMutation` hook
- Handles loading, error, and success states
- Automatic error logging

### 5. **Query Provider** - [src/providers.tsx](src/providers.tsx)
- `Providers` component wrapping the app with `QueryClientProvider`
- Configured with 5-minute stale time and 10-minute cache time

### 6. **Signup Page** - [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx)
- **React Hook Form** for form state management
- **Zod** for validation with real-time error display
- **TanStack Query** for API calls
- Features:
  - Real-time field validation
  - Server error display
  - Loading state on submit button
  - Automatic redirect to dashboard on success
  - Form reset after successful signup

## Setup Instructions

### 1. Update Environment Variables
Create a `.env.local` file (or update existing one):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 2. Dependencies Installed
- `@tanstack/react-query` - State management for server data
- `zod` - Schema validation
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Integration between react-hook-form and Zod
- `axios` - HTTP client

## How It Works

### Form Submission Flow
1. User enters full name, email, and password
2. React Hook Form validates using Zod schema
3. Real-time error messages display for invalid fields
4. On valid submit, `useSignup` mutation is triggered
5. Axios sends POST to `/auth/signup`
6. Success: User redirected to `/dashboard`
7. Error: Server error message displayed

### State Management
- **TanStack Query** manages API call states (loading, error, success)
- `isPending` state shows loading UI
- Error handling for both validation and API errors
- Automatic cache management

## Password Requirements
Users must create passwords with:
- ✓ At least 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)

Example: `MyPassword123`

## Error Handling
- **Validation Errors**: Displayed below each field in real-time
- **Network Errors**: Displayed in a banner at the top of the form
- **API Errors**: Backend error messages shown to the user
- **Fallback**: Generic error message if details unavailable

## Next Steps
- [ ] Implement signin page with similar pattern
- [ ] Add password confirmation field (optional)
- [ ] Add email verification flow
- [ ] Implement token storage after successful signup
- [ ] Add loading skeletons for better UX
- [ ] Implement forgot password flow
