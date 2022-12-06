import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { TezosProvider } from "context/TezosContext";
import ClientOnly from "components/ClientOnly";

function MyApp({ Component, pageProps }) {
  return (
    <ClientOnly>
      <TezosProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </TezosProvider>
    </ClientOnly>
  );
}

export default MyApp;
