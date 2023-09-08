import { WindowReader } from "@/components/HOC/WindowReader/WindowReader";
import { store } from "@/redux/store";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { theme } from "~styles/theme";
import "../styles/globals.scss";

const persistor = persistStore(store);

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <WindowReader>
            <Component {...pageProps} />
          </WindowReader>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
}
