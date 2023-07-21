import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { 
    persistReducer, 
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// const createNoopStorage = () => {
//     return {
//         getItem(_key) {
//             return Promise.resolve(null);
//         },
//         setItem(_key, value) {
//             return Promise.resolve(value);
//         },
//         removeItem(_key) {
//             return Promise.resolve();
//         },
//     };
// };

// const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
    const store = configureStore({ 
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
    });
    store.__persistor = persistStore(store);
    return store;
};

export const wrapper = createWrapper(makeStore);
