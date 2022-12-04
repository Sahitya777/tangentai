import { useState } from "react";

export default function PromptForm({ prompt, setPrompt, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <div className="flex flex-row justify-center items-center p-2">
        <input
          type="text"
          defaultValue={prompt}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          name="prompt"
          className="bg-transparent w-[250px] lg:w-[500px] md:w-[350px] relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 focus:border-none focus:ring-gray-900/20 focus:outline-none ring-gray-900/10 hover:ring-gray-900/20 shadow-sm"
          placeholder="Enter a prompt..."
        />
        <button
          type="submit"
          className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 m-2 shadow-sm"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
