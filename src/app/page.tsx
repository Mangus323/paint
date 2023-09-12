"use client";

import React, { JSX } from "react";
import { KeyboardListener } from "@/components/HOC/KeyboardListener/KeyboardListener";
import { MouseListener } from "@/components/HOC/MouseListener/MouseListener";
import { LeftPanel } from "@/components/blocks/LeftPanel/LeftPanel";
import { TopPanel } from "@/components/blocks/TopPanel/TopPanel";
import { DefaultLayout } from "@/components/layouts/DefaultLayout/DefaultLayout";
import { useAppSelector } from "@/redux/store";
import "@/styles/globals.scss";
import dynamic from "next/dynamic";
import Head from "next/head";

const Canvas = dynamic(
  () => import("@/components/blocks/Canvas/Canvas").then(res => res.Canvas),
  {
    ssr: false
  }
);

export default function Homepage(): JSX.Element {
  const { canvasHeight, canvasWidth } = useAppSelector(state => state.browser);

  return (
    <MouseListener>
      <KeyboardListener>
        <Head>
          <title>Paint</title>
        </Head>
        <DefaultLayout>
          <TopPanel />
          <LeftPanel />
          {canvasHeight !== 0 && canvasWidth !== 0 && <Canvas />}
        </DefaultLayout>
      </KeyboardListener>
    </MouseListener>
  );
}
