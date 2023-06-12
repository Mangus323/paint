import { WindowReader } from "@/components/HOC/WindowReader/WindowReader";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <WindowReader>
        <Component {...pageProps} />
      </WindowReader>
    </Provider>
  );
}
