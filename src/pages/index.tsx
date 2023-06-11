import { Homepage } from "@/components/pages/Homepage";
import { GetStaticProps } from "next";

export default Homepage;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  };
};
