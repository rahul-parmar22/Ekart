import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import productSlice from "./productSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "Ekart",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  user: userSlice,
  product: productSlice, //ahi je product: key chhe e useSelector thi calue store thi select kare je componnet tya aa same aapvanu hoy example:   const { products } = useSelector((store) => store.product); ahi je store.product chhe to e ahini key "product" chhee e chhe..jo "store.prodcuts" thay to no chale kemke ek "s" extra aavi gyo...desetructure no thay
 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

//without persist aatluj aave nichhe chhe e
//   import { configureStore } from "@reduxjs/toolkit"
// import userSlice from './userSlice.js'

//   const store = configureStore({
//     reducer:{
//       user:userSlice
//     }
//   });
//   export default store;

//documentation:   https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/
//khali aatalu karvathi pan code fully run kare chhe to bijo eoxtra code no lakho to pan chale....chatgpt pase pan good chhe code.

// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userSlice from "./userSlice.js";
// import productSlice from "./productSlice.js";
// import {
//   persistReducer,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "Ekart",
//   version: 1,
//   storage,
// };
// const rootReducer = combineReducers({
//   user: userSlice,
//   product: productSlice //ahi je product: key chhe e useSelector thi value store thi select kare je componnet tya aa same aapvanu hoy example:   const { products } = useSelector((store) => store.product); ahi je store.product chhe to e ahini key "product" chhee e chhe..jo "store.prodcuts" thay to no chale kemke ek "s" extra aavi gyo...desetructure no thay
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
// });

// export default store;