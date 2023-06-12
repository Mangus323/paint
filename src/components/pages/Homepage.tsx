import React, { JSX } from "react";
import { Canvas } from "@/components/blocks/Canvas/Canvas";
import { DefaultLayout } from "@/components/layouts/DefaultLayout/DefaultLayout";

export const Homepage = (): JSX.Element => {
  return (
    <DefaultLayout>
      <Canvas />
    </DefaultLayout>
  );
};
