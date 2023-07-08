import React, { JSX } from "react";
import { Canvas } from "@/components/blocks/Canvas/Canvas";
import { LeftPanel } from "@/components/blocks/LeftPanel/LeftPanel";
import { TopPanel } from "@/components/blocks/TopPanel/TopPanel";
import { DefaultLayout } from "@/components/layouts/DefaultLayout/DefaultLayout";
import { RootState } from "@/redux/store";
import Head from "next/head";
import { useSelector } from "react-redux";

export const Homepage = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );

  return (
    <>
      <Head>
        <title>Paint</title>
      </Head>
      <DefaultLayout>
        <TopPanel />
        <LeftPanel />
        {canvasHeight !== 0 && canvasWidth !== 0 && <Canvas />}
      </DefaultLayout>
    </>
  );
};
