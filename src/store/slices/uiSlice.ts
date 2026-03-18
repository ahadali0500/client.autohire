import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
}

const initialState: UIState = {
  theme: 'dark',
  sidebarOpen: true,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>
    ) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
