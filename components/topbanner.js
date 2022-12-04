import { PaintBrushIcon } from "@heroicons/react/24/outline";

export default function TopBanner({ connect, disconnect, address }) {
  return (
    <div className="fixed inset-x-0 top-5 pb-2 sm:pb-5">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-gray-50 bg-opacity-25 p-2  sm:p-3 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-gray-800 p-2">
                <PaintBrushIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 truncate font-medium text-gray-500">
                <span className="md:inline">Tangent AI</span>
              </p>
            </div>
            <div className="order-3 mt-0 ml-2 w-auto flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
              {address.length === 0 ? (
                <button
                  onClick={() => connect()}
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  Connect Wallet
                </button>
              ) : (
                <button
                  onClick={() => disconnect()}
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  {"Disconnect Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
