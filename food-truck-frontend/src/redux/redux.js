import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/root';

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const buildStore = (initialState) => {
    const store = configureStore({
        preloadedState: initialState,
        reducer: persistedReducer,
        middleware: [thunk],
        devTools: process.env.NODE_ENV !== 'production'
    });

    const persistor = persistStore(store);

    return {store, persistor}
};