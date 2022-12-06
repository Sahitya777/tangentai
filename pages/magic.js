import { useState, useContext, useEffect, useMemo } from "react";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Banner from "components/banner";
import TopBanner from "components/topbanner";
import { TezosContext } from "context/TezosContext";
import Header from "components/header";
import { NFTStorage, Token } from "nft.storage";
import { mintNFT } from "actions";
import PredictionOutput from "components/PredictionOutput";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// initialising nft.storage
const nftAPI = process.env.NEXT_PUBLIC_NFT_API_KEY;
const client = new NFTStorage({ token: nftAPI });

export default function Home() {
  const { wallet, tezos } = useContext(TezosContext);
  const [tzAddres, setTzAddress] = useState("");

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // const predictionURL = useMemo(() => {
  //   if (predictions.length === 0) return "";
  //   else {
  //     const last = predictions[predictions.length - 1];
  //     if (last.status === "succeeded") {
  //       return last.output[last.output.length - 1];
  //     } else {
  //       return "";
  //     }
  //   }
  // }, [predictions]);

  // const loadingPrediction = useMemo(() => {
  //   return predictions.length
  //     ? predictions[predictions.length - 1].status === "processing"
  //     : false;
  // }, [predictions]);

  // const handleMint = async (e) => {
  //   e.preventDefault();

  //   // const img = await fetch(predictionURL);
  //   // const imgBlob = await img.blob();

  //   const { token, car } = await Token.Token.encode({
  //     decimals: 0,
  //     isBooleanAmount: true,
  //     name: "Tangent NFT",
  //     description: `NFT generated from ${prompt}`,
  //     minter: tzAddres,
  //     creators: ["Tangent Creators"],
  //     date: new Date(),
  //     type: "Tangent",
  //     tags: ["Tangent", "AI NFT", "Generative NFT"],
  //     ttl: 600,
  //     language: "en",
  //     artifactUri: predictionURL,
  //     displayUri: predictionURL,
  //     thumbnailUri: predictionURL,
  //     externalUri: "https://tangentai.xyz",
  //     attributes: [
  //       {
  //         name: "prompt",
  //         value: prompt,
  //       },
  //     ],
  //   });

  //   const metadata = await client.storeCar(car);
  //   console.log("metadata", metadata);
  //   console.log("token", token);

  //   mintNFT({
  //     tezos,
  //     metadata: `https://gateway.ipfs.io/ipfs/${metadata}/metadata.json`,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    const prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    setPredictions((preds) => preds.concat([prediction]));
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        console.log("error", prediction.detail);
        return;
      }
      setPredictions((preds) => preds.concat([prediction]));
    }
  };

  async function connectWallet() {
    let walletAddress;

    const active = await wallet.client.getActiveAccount();
    if (active) walletAddress = active;
    else {
      const permissions = await wallet.client.requestPermissions({
        network: {
          type: "ghostnet",
        },
      });
      walletAddress = permissions.address;
    }

    setTzAddress(walletAddress);
  }

  async function disconnectWallet() {
    await wallet.client.clearActiveAccount();
    setTzAddress("");
  }

  return (
    <div className="isolate bg-white font-poppins">
      <title>Tangent</title>
      <BlurElementTop />
      <BlurElementBottom />

      <Header
        connect={connectWallet}
        disconnect={disconnectWallet}
        address={tzAddres}
      />

      <div className="flex flex-col justify-center items-center p-2 mt-28 lg:mt-52">
        <h1 className="text-3xl md:text-6xl lg:text-7xl lg:mt-0 p-4 font-bold text-gray-800">
          What&apos;s on your mind?
        </h1>
        <div className="flex flex-row mt-2">
          <PromptForm
            handleSubmit={handleSubmit}
            prompt={prompt}
            setPrompt={setPrompt}
            minter={tzAddres}
          />
        </div>
      </div>

      <div className="pt-[2px] p-2">
        {error && <div>{error}</div>}
        <div className="border-hairline max-w-[512px]  lg:p-0 mx-auto relative rounded-3xl">
          <div className="bg-transparent max-h-[512px] lg:max-h-[512px] md:max-h-[512px] w-full flex flex-col items-stretch rounded-lg border-gray-600">
            <div className="flex lg:hidden md:hidden">
              <TopBanner
                connect={connectWallet}
                disconnect={disconnectWallet}
                address={tzAddres}
              />
            </div>
            <div className="hidden lg:flex md:flex">
              <Banner
                connect={connectWallet}
                disconnect={disconnectWallet}
                address={tzAddres}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BlurElementTop = () => (
  <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
    <svg
      className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
      viewBox="0 0 1155 678"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
        fillOpacity=".3"
        d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
      />
      <defs>
        <linearGradient
          id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
          x1="1155.49"
          x2="-78.208"
          y1=".177"
          y2="474.645"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9089FC" />
          <stop offset={1} stopColor="#FF80B5" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const BlurElementBottom = () => (
  <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
    <svg
      className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
      viewBox="0 0 1155 678"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
        fillOpacity=".3"
        d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
      />
      <defs>
        <linearGradient
          id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
          x1="1155.49"
          x2="-78.208"
          y1=".177"
          y2="474.645"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9089FC" />
          <stop offset={1} stopColor="#FF80B5" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
