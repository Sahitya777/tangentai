import React from "react";
import Image from "next/image";
import { Skeleton } from "@chakra-ui/react";

const PredictionOutput = ({ imgURL, loading }) => {
  return (
    <div className="relative w-full aspect-square">
      {imgURL && (
        <Image
          // alt={"prediction" + index}
          // key={"prediction" + index}
          layout="fill"
          className="absolute animate-in fade-in rounded-lg"
          // style={{ zIndex: index }}
          src={imgURL}
        />
      )}
      {/* SPINNER */}
      {loading && (
        <div>
          <Skeleton rounded={"7px"} height="455px" width="512px"></Skeleton>
        </div>
      )}
      {/* {(predictions.length > 0 || this.props.userUploadedImage) &&
        !predicting && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: predictions.length + 100 }}
          ></div>
        )} */}
    </div>
  );
};

export default PredictionOutput;
