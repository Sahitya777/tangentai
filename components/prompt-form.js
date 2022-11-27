import { useState } from "react";

export default function PromptForm(props) {
  const [prompt] = useState();
  return (
    <form onSubmit={props.onSubmit} className="animate-in fade-in duration-700">
      <div className="flex flex-row justify-center items-center p-2">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          className="bg-transparent w-[250px] lg:w-[500px] md:w-[350px] relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
          placeholder="Enter a prompt..."
        />
        <button
          type="submit"
          className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 m-2"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
