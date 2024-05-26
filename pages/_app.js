import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TezosProvider } from "context/TezosContext";

function MyApp({ Component, pageProps }) {
  return (
    <TonConnectUIProvider manifestUrl="http://localhost:3000/api/tonconnect">
      <TezosProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </TezosProvider>
    </TonConnectUIProvider>
  );
}

export default MyApp;
