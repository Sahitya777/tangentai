import React from "react";
import Image from "next/image";
import { Skeleton } from "@chakra-ui/react";
import { mintNFT } from "actions";

//mint
const onSubmit = (e) => {
  e.preventDefault();
  if (name === "" || description === "" || filesContent.length === 0) {
    setError("Some Error Occurred. Please check again.");
    return;
  }
  setLoading(true);
  setError("");

  (async () => {
    const metadata = await client.store({
      name: TangentAI, //add the tokenID too
      description: "Beautifullu generated with TangentAI ✨",
      image: prediction.output,
    });
    console.log(metadata);
    dispatch(mintNFT({ tezos, amount, metadata: metadata.url }));

    setLoading(false);
    setName("");
    setDescription("");
  })();
};
export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  onChange = async () => {
    const paths = await this.canvas.current.exportPaths();

    // only respond if there are paths to draw (don't want to send a blank canvas)
    if (paths.length) {
      const data = await this.canvas.current.exportImage("svg");
      this.props.onDraw(data);
    }
  };

  render() {
    const predictions = this.props.predictions.map((prediction) => {
      console.log("Image Url", prediction.output);

      prediction.lastImage = prediction.output
        ? prediction.output[prediction.output.length - 1]
        : null;
      return prediction;
    });

    const predicting = predictions.some((prediction) => !prediction.output);
    const lastPrediction = predictions[predictions.length - 1];

    return (
      <div className="relative w-full aspect-square">
        {/* PREDICTION IMAGES */}

        {!this.props.userUploadedImage &&
          predictions
            .filter((prediction) => prediction.output)
            .map((prediction, index) => (
              <div key="index" className="flex flex-col">
                <Image
                  alt={"prediction" + index}
                  key={"prediction" + index}
                  layout="fill"
                  className="absolute animate-in fade-in rounded-lg"
                  style={{ zIndex: index }}
                  src={prediction.lastImage}
                />
                <button
                  onClick={onSubmit}
                  className="relative max-w-[512px] items-center justify-center mt-[470px] rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium shadow-sm text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  Mint your art
                </button>
              </div>
            ))}

        {/* USER UPLOADED IMAGE */}
        {this.props.userUploadedImage && (
          <Image
            src={URL.createObjectURL(this.props.userUploadedImage)}
            alt="preview image"
            layout="fill"
          />
        )}

        {/* SPINNER */}
        {predicting && (
          <div>
            <Skeleton rounded={"7px"} height="455px" width="512px">
              {lastPrediction.status}
            </Skeleton>
          </div>
        )}

        {(predictions.length > 0 || this.props.userUploadedImage) &&
          !predicting && (
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: predictions.length + 100 }}
            ></div>
          )}
      </div>
    );
  }
}
