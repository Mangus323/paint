"use client";

import React from "react";
import { WindowReader } from "@/components/HOC/WindowReader/WindowReader";
import { MobilePage } from "@/components/layouts/MobilePage/MobilePage";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import { store } from "@/redux/store";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { theme } from "~styles/theme";

const persistor = persistStore(store);

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsTouchDevice();

  return (
    <html lang="en">
      <head>
        <title>Paint</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          {isMobile && <MobilePage />}
          {!isMobile && <DefaultProviders>{children}</DefaultProviders>}
        </ThemeProvider>
      </body>
    </html>
  );
}

const DefaultProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WindowReader>{children}</WindowReader>
      </PersistGate>
    </Provider>
  );
};
