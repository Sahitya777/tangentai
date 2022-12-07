import { Fragment, useState, useMemo, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PredictionOutput from "./PredictionOutput";
import { NFTStorage, Token } from "nft.storage";
import { mintNFT } from "actions";
import { TezosContext } from "context/TezosContext";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nftAPI = process.env.NEXT_PUBLIC_NFT_API_KEY;
const client = new NFTStorage({ token: nftAPI });

export default function PromptForm({
  prompt,
  setPrompt,
  minter,
  connect,
  disconnect,
  address,
}) {
  const [predictions, setPredictions] = useState([]);
  const { tezos } = useContext(TezosContext);
  const [error, setError] = useState(null);

  const [isMinting, setIsMinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMint = async (e) => {
    e.preventDefault();
    setIsMinting(true);
    try {
      const { token, car } = await Token.Token.encode({
        decimals: 0,
        isBooleanAmount: true,
        name: "Tangent NFT",
        description: `NFT generated from ${prompt}`,
        minter: minter,
        creators: ["Tangent Creators"],
        date: new Date().toUTCString(),
        type: "Tangent",
        tags: ["Tangent", "AI NFT", "Generative NFT"],
        ttl: 600,
        language: "en",
        artifactUri: predictionURL,
        displayUri: predictionURL,
        thumbnailUri: predictionURL,
        externalUri: "https://tangentai.xyz",
        royalties: {
          decimals: 3,
          shares: {
            tz1MToiEvTLZXPFoLqjzbiUPPKrKMqjLrtki: 50,
          },
        },
        attributes: [
          {
            name: "prompt",
            value: prompt,
          },
        ],
      });

      const metadata = await client.storeCar(car);
      console.log("metadata", metadata);
      console.log("token", token);

      await mintNFT({
        tezos,
        metadata: `https://gateway.ipfs.io/ipfs/${metadata}/metadata.json`,
      });
      setIsMinting(false);
    } catch {
      console.log("ERROR.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

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
      console.log("error", prediction.detail);
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
        return;
      }
      setPredictions((preds) => preds.concat([prediction]));
      setIsGenerating(false);
    }
  };

  const predictionURL = useMemo(() => {
    if (predictions.length === 0) return "";
    else {
      const last = predictions[predictions.length - 1];
      if (last.status === "succeeded") {
        return last.output[last.output.length - 1];
      } else {
        return "";
      }
    }
  }, [predictions]);

  const loadingPrediction = useMemo(() => {
    return predictions.length
      ? predictions[predictions.length - 1].status === "processing"
      : false;
  }, [predictions]);

  const [open, setOpen] = useState(false);
  return (
    <div>
      <div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-100 px-4 pt-5 pb-4 text-left shadow-sm border-2 transition-all sm:my-8 sm:w-8xl sm:max-w-full sm:p-6">
                    <div className="flex justify-end pb-6">
                      <XMarkIcon
                        onClick={() => setOpen(false)}
                        className="h-[20px]"
                      />
                    </div>
                    <div className="flex flex-col  md:flex-row h-[600px]">
                      <PredictionOutput
                        imgURL={predictionURL}
                        loading={isGenerating || loadingPrediction}
                      />

                      {predictionURL && (
                        <div className="flex flex-col m-4 ml-8 max-w-xs">
                          <text className="text-2xl mt-2 italic font-serif font-extralight ">
                            &quot;{prompt}&quot;
                          </text>

                          {!minter && (
                            <button
                              className="mt-8 disabled flex items-center justify-center cursor-not-allowed rounded-md border-2 border-cyan-700 bg-cyan-700 px-4 py-2 font-bold shadow-lg text-gray-50"
                              disabled
                            >
                              Mint NFT
                            </button>
                          )}

                          {minter && (
                            <button
                              className="mt-8 disabled flex items-center justify-center rounded-md border-2 border-cyan-700 bg-cyan-700 px-4 py-2 font-bold shadow-lg text-gray-50"
                              onClick={handleMint}
                              disabled={isMinting}
                            >
                              {isMinting ? "Minting..." : "Mint NFT"}
                            </button>
                          )}

                          <button
                            className="text-cyan-800 mt-3 flex items-center justify-center rounded-md border-2 border-cyan-700 px-4 py-2 font-bold shadow-sm text-sm"
                            onClick={() => setOpen(false)}
                          >
                            Back to Home
                          </button>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
        <div className="flex flex-row justify-center items-center p-2">
          <input
            type="text"
            // defaultValue={prompt}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            name="prompt"
            className="bg-transparent w-[250px] lg:w-[500px] md:w-[350px] relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 focus:border-none focus:ring-gray-900/20 focus:outline-none ring-gray-900/10 hover:ring-gray-900/20 shadow-sm"
            placeholder="Enter a prompt..."
          />
          <button
            type="submit"
            onClick={() => {
              setOpen(true);
            }}
            className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 m-2 shadow-sm"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
