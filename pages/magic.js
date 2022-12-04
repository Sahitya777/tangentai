import { useState, useContext, useEffect } from "react";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Banner from "components/banner";
import TopBanner from "components/topbanner";
import { TezosContext } from "context/TezosContext";
import Header from "components/header";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const { wallet, tezos } = useContext(TezosContext);
  const [tzAddres, setTzAddress] = useState("");

  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prevPrediction = predictions[predictions.length - 1];
    //Link to generated art ⬇
    const prevPredictionOutput = prevPrediction?.output
      ? prevPrediction.output[prevPrediction.output.length - 1]
      : null;

    const body = {
      prompt: e.target.prompt.value,
      init_image: userUploadedImage
        ? await readAsDataURL(userUploadedImage)
        : // only use previous prediction as init image if there's a mask
        maskImage
        ? prevPredictionOutput
        : null,
      mask: maskImage,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPredictions(predictions.concat([prediction]));
    console.log(prevPredictionOutput);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setUserUploadedImage(null);
      }
    }
  };

  async function connectWallet() {
    let walletAddress;

    const active = await wallet.client.getActiveAccount();
    if (active) walletAddress = active;
    else {
      const permissions = await wallet.client.requestPermissions();
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
      <Header
        connect={connectWallet}
        disconnect={disconnectWallet}
        address={tzAddres}
      />
      <div className="flex flex-col justify-center items-center p-2 mt-28 lg:mt-0">
        <h1 className="text-3xl md:text-6xl lg:text-6xl mt-5 lg:mt-0 p-4 font-bold text-gray-800">
          What&apos;s on your mind ?
        </h1>
        <div className="mt-2">
          <PromptForm onSubmit={handleSubmit} />
        </div>
      </div>
      <div className="pt-[2px] p-2">
        {error && <div>{error}</div>}
        <div className="border-hairline max-w-[512px]  lg:p-0 mx-auto relative rounded-3xl">
          <div className="bg-transparent max-h-[455px] lg:max-h-[455px] md:max-h-[455px] w-full flex items-stretch rounded-lg border-gray-600">
            <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            />
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

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
