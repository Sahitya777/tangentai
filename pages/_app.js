import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { TezosProvider } from "context/TezosContext";

function MyApp({ Component, pageProps }) {
  return (
    <TezosProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </TezosProvider>
  );
}

export default MyApp;
