import { useState } from "react";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prevPrediction = predictions[predictions.length - 1];
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

  const startOver = async (e) => {
    e.preventDefault();
    setPredictions([]);
    setError(null);
    setMaskImage(null);
    setUserUploadedImage(null);
  };

  return (
    <div className="font-serif">
      <title>Tangent</title>
      <div id="header" className="flex flex-row h-20 w-full p-2 ">
        {/* <text className="text-black font-black text-3xl">
          Tangent
        </text> */}
        <div className="ml-20 md:ml-2 md:mr-2 m-2 p-2">
          <div className="text-center">
            <h1 className="lg:text-3xl text-2xl font-bold">
              <span className="text-blue-200 mr-1">{" // "}</span> Tangent AI{" "}
              <span className="text-blue-200 ml-1">{" // "}</span>
            </h1>
            <p className="mt-2 text-xs lg:text-base">
              ~ AI Generated NFTs on Tezos ~
            </p>
          </div>
        </div>
        <div className="items-center justify-end md:flex md:flex-1 p-2 ml-16 hidden">
          <button className="text-gray-700 shadow-md font-medium border-2 p-2 border-blue-200 hover:border-blue-300 rounded-lg hover:bg-gray-100">
            Connect Wallet
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-2 mt-12">
        <text className="text-2xl lg:text-5xl p-4 bg-clip-text font-bold text-transparent bg-gradient-to-r from-gray-400 antialiased to to-gray-800">
          What&apos;s on your mind ?
        </text>
        <PromptForm onSubmit={handleSubmit} />
      </div>
      <div className="pt-[10px] p-2">
        {error && <div>{error}</div>}
        <div className="border-hairline max-w-[512px] lg:p-0 mx-auto relative rounded-3xl">
          <Dropzone
            onImageDropped={setUserUploadedImage}
            predictions={predictions}
            userUploadedImage={userUploadedImage}
          />
          <div className="bg-gray-50 relative max-h-[500px] w-full flex items-stretch rounded-lg border-2 border-dashed shadow-md border-gray-600">
            <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-1 border-gray-400 border-rouned-lg">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <p className="ml-3 truncate font-medium ">
                <span className="md:inline text-gray-500">
                  Made with 🍑 by Rohan and Manan
                </span>
              </p>
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
