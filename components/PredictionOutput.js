import React from "react";
import Image from "next/image";
import Spinner from "./spinner";
const PredictionOutput = ({ imgURL, loading }) => {
  return (
    <div className="relative w-full aspect-square ">
      {imgURL && (
        <Image
          alt={"Prediction"}
          layout="fill"
          className="absolute animate-in fade-in rounded-lg "
          src={imgURL}
        />
      )}
      {/* SPINNER */}
      {loading && (
        <div>
          <div className="flex justify-center pt-52">
            <Spinner />
          </div>
          <div className="">
            <h1 className="text-center mt-6 mx-2 text-lg font-bold">
              Generating your masterpiece 🎨
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionOutput;
