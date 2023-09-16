"use client";

import React from "react";
import { WindowReader } from "@/components/HOC/WindowReader/WindowReader";
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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <WindowReader>{children}</WindowReader>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
