"use client";

import React, { JSX } from "react";
import { ActiveElementProvider } from "@/components/HOC/ActiveElementProvider";
import { KeyboardListener } from "@/components/HOC/KeyboardListener";
import { MouseListener } from "@/components/HOC/MouseListener";
import { ScrollProvider } from "@/components/HOC/ScrollProvider";
import { WindowReader } from "@/components/HOC/WindowReader";
import { LeftPanel } from "@/components/blocks/LeftPanel/LeftPanel";
import { TopPanel } from "@/components/blocks/TopPanel/TopPanel";
import { Toaster } from "@/components/elements/Toaster/Toaster";
import { DefaultLayout } from "@/components/layouts/DefaultLayout/DefaultLayout";
import { useAppSelector } from "@/redux/store";
import "@/styles/globals.scss";
import dynamic from "next/dynamic";
import Head from "next/head";

const Canvas = dynamic(
  () =>
    import("@/components/blocks/Canvas/Canvas").then(module => module.Canvas),
  {
    ssr: false
  }
);

const MemoCanvas = React.memo(Canvas);

export default function Homepage(): JSX.Element {
  const { canvasHeight, canvasWidth } = useAppSelector(state => state.browser);

  return (
    <ActiveElementProvider>
      <ScrollProvider>
        <WindowReader>
          <MouseListener>
            <KeyboardListener>
              <Head>
                <title>Paint</title>
              </Head>
              <DefaultLayout>
                <TopPanel />
                <LeftPanel />
                {canvasHeight !== 0 && canvasWidth !== 0 && <MemoCanvas />}
                <Toaster />
              </DefaultLayout>
            </KeyboardListener>
          </MouseListener>
        </WindowReader>
      </ScrollProvider>
    </ActiveElementProvider>
  );
}
