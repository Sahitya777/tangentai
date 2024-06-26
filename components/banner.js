import { PaintBrushIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Banner() {
  return (
    <div>
      <div className="fixed inset-x-0 bottom-0 pb-2 sm:pb-3">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gray-50 bg-opacity-10 p-2 shadow-lg sm:p-3 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 flex-1 items-center">
                <Link href="/">
                  <span className="flex rounded-lg bg-gray-800 p-2">
                    <PaintBrushIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </Link>

                <p className="ml-3 truncate font-medium text-gray-500">
                  <Link href="/">
                    <span className="md:inline hover:underline">Tangent AI</span>
                  </Link>
                </p>
              </div>
              <div className="order-3 mt-0 w-auto flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                <a
                  href="https://rohanphw.notion.site/Tangent-AI-978ec36ea968484a9c5556808ac604e8"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
