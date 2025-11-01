# Backend Integration Guide

This document explains how the frontend connects to the backend API for live compatibility updates.

## Overview

The frontend now integrates with the backend matching algorithm to:
1. **Sync user preferences** with the backend when the questionnaire is completed
2. **Fetch real-time matches** calculated by the Hungarian algorithm
3. **Live update compatibility scores** as new users join or preferences change
4. **Automatically refresh matches** every 30 seconds

## Architecture

### API Service Layer (`src/lib/api.ts`)
- Base HTTP client with error handling
- Supports GET, POST, PUT, DELETE methods
- Configurable API base URL via `VITE_API_URL` environment variable

### User Service (`src/services/userService.ts`)
- Manages user data synchronization between localStorage and backend
- Automatically creates/updates user records when preferences change
- Stores user ID in localStorage for session management

### Match Service (`src/services/matchService.ts`)
- Fetches matches from backend API endpoints
- Handles compatibility breakdown data structure

### React Query Hooks

#### `useMatches` / `useMatchesWithAutoRefresh`
- Fetches top matches for current user
- **Live Updates**: Automatically polls backend every 30 seconds (configurable)
- Invalidates cache when preferences are updated
- Returns loading, error, and data states

#### `useUser` hooks
- `useSyncUser`: Syncs localStorage data with backend
- `useUpdateUser`: Updates user preferences
- `useCreateUser`: Creates new user account

## How Live Updates Work

### 1. **Polling Mechanism**
```typescript
// Matches are polled every 30 seconds
const { matches } = useMatchesWithAutoRefresh(10, 30000);
```

### 2. **Preference Change Detection**
- When questionnaire is completed, preferences are saved to localStorage
- `useSyncUser` is called to sync with backend
- React Query invalidates match queries, triggering immediate refetch

### 3. **Automatic Refetch Triggers**
- Window focus (user returns to tab)
- Component mount
- Manual invalidation after preference updates
- Periodic polling (every 30 seconds)

### 4. **Smart Caching**
- Data is considered stale after 10 seconds
- Failed requests retry once
- Cache is shared across components

## Backend API Endpoints

### User Endpoints (`/api/users`)
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Match Endpoints (`/api/matches`)
- `GET /api/matches/user/:id?limit=10` - Get top matches for user
- `GET /api/matches/all` - Get all matches (admin)
- `GET /api/matches/stats` - Get compatibility statistics

## Data Flow

```
User completes questionnaire
    ↓
Preferences saved to localStorage
    ↓
useSyncUser hook called
    ↓
POST/PUT to /api/users (create or update)
    ↓
React Query invalidates match cache
    ↓
GET /api/matches/user/:id?limit=10
    ↓
Backend calculates matches using Hungarian algorithm
    ↓
Frontend receives matches with compatibility scores
    ↓
UI updates automatically
    ↓
[Polling continues every 30 seconds]
```

## Configuration

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:3001/api
```

If not set, defaults to `http://localhost:3001/api`.

### Polling Interval

Adjust the polling interval in `src/components/Matches.tsx`:

```typescript
// Change 30000 (30 seconds) to your preferred interval
const { matches } = useMatchesWithAutoRefresh(10, 30000);
```

### React Query Configuration

Modify `src/App.tsx` to adjust global query defaults:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,        // Data considered stale after 10s
      refetchOnWindowFocus: true, // Refetch when tab regains focus
      retry: 1,                // Retry failed requests once
    },
  },
});
```

## Usage Examples

### Fetching Matches with Live Updates

```typescript
import { useMatchesWithAutoRefresh } from '@/hooks/useMatches';

function MatchesComponent() {
  // Fetches top 10 matches, polls every 30 seconds
  const { matches, isLoading, isError, isFetching } = useMatchesWithAutoRefresh(10, 30000);
  
  // isFetching indicates background updates are happening
  // isLoading indicates initial data load
}
```

### Syncing User Preferences

```typescript
import { useSyncUser } from '@/hooks/useUser';

function QuestionnaireComponent() {
  const syncUser = useSyncUser();
  
  const handleComplete = async () => {
    // Save to localStorage first
    localStorage.setItem('roommate_preferences', JSON.stringify(answers));
    
    // Sync with backend
    await syncUser.mutateAsync();
    // Matches will automatically refresh
  };
}
```

### Manual Match Refresh

```typescript
import { useInvalidateMatches } from '@/hooks/useMatches';

function MyComponent() {
  const invalidateMatches = useInvalidateMatches();
  
  const handleRefresh = () => {
    invalidateMatches(); // Triggers refetch
  };
}
```

## Troubleshooting

### Matches Not Loading
1. **Check backend is running**: `http://localhost:3001/health`
2. **Verify user is synced**: Check browser console for user ID
3. **Check network tab**: Ensure API calls are succeeding
4. **Verify questionnaire completed**: Preferences must be in localStorage

### Live Updates Not Working
1. **Check polling interval**: Verify `useMatchesWithAutoRefresh` is being used
2. **Check React Query DevTools**: Install React Query DevTools to debug cache
3. **Verify backend updates**: Check if backend recalculates matches correctly

### Backend Connection Errors
1. **CORS issues**: Ensure backend has CORS enabled (already configured)
2. **API URL**: Verify `VITE_API_URL` environment variable
3. **Network**: Check if backend is accessible from browser

## Testing Live Updates

1. **Complete questionnaire** in one browser tab
2. **Open another tab** and complete questionnaire with different preferences
3. **Return to first tab** - matches should update automatically
4. **Wait 30 seconds** - matches should refresh in background
5. **Switch tabs** - matches should refetch on focus

## Performance Considerations

- **Polling interval**: 30 seconds balances freshness vs server load
- **Cache**: React Query caches responses to avoid unnecessary requests
- **Stale time**: 10 seconds prevents rapid refetches
- **Background updates**: UI doesn't block during updates

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Server-Sent Events (SSE) for push notifications
- [ ] Optimistic updates for better UX
- [ ] Match filtering and sorting options
- [ ] Pagination for large match lists

