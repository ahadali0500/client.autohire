import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import agentReducer from './slices/agentSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};
console.log("zytor");


const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);



import { Middleware } from "@reduxjs/toolkit";

export const simpleAlertMiddleware: Middleware = (store) => (next) => (action: any) => {
  
 console.log('Dispatching action:', action.type);

  // 3. Always call next(action) so the Redux state actually updates!
  return next(action);
};


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: uiReducer,
    agents: agentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(simpleAlertMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
