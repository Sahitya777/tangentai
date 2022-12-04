import { useEffect } from "react";


export default function Header({ connect, disconnect, address }) {

 
  return (
    <div className="hidden lg:flex md:flex justify-end m-4">
      <div className="order-3 mt-0 ml-2 w-auto flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
        {address.length === 0 ? (
          <button
            onClick={() => connect()}
            className="flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium shadow-sm text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium shadow-sm text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
          >
            {"Disconnect Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}
