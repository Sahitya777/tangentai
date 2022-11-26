import { useState } from "react";
import { GrCircleQuestion } from "react-icons/gr";
import { Tooltip } from "@chakra-ui/react";

export default function PromptForm(props) {
  const [prompt] = useState();
  const [image, setImage] = useState(null);

  return (
    <form onSubmit={props.onSubmit} className="animate-in fade-in duration-700">
      <div className="flex flex-row justify-center items-center p-2">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          className=" border-2 shadow-md border-blue-300 rounded-lg focus:outline-none text-gray-400 p-2 focus:border-blue-400"
          placeholder="Enter a prompt..."
        />
        <button
          type="submit"
          className="text-gray-400 shadow-md border-2 p-2 border-blue-300 hover:border-blue-400 rounded-lg hover:bg-gray-100 hover:text-gray-400 m-2"
        >
          Generate
        </button>
        <div className="m-1">
          <Tooltip
            hasArrow
            label="What's a good prompt ?
            A balanced combination of colour scheme, scene description and maybe reference to any artist or a designer with picture quality defined"
            rounded="md"
          
          >
            <text className="text-2xl shadow-md">
              <GrCircleQuestion />
            </text>
          </Tooltip>
        </div>
      </div>

      {/* <Flex>
      <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a prompt..."
          className="block w-full flex-grow rounded-l-md"

          style={{padding:"6px", background:"none", color:"white", width:"00px", border:"1px solid #2F3150"}}
        >
          </input>

        <button
          className="text-black rounded-r-md text-small inline-block px-3 flex-none"
          type="submit"
          style={{background:"#2F3150", color:"white"}}
        >
          Generate
        </button>
      </Flex> */}
    </form>
  );
}
