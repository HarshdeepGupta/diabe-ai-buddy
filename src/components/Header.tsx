
import { Calendar } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Calendar className="h-8 w-8 text-diabetes-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">
                DiabetesAI Companion
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-6 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-diabetes-700 hover:text-diabetes-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Resources
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-diabetes-600 hover:bg-diabetes-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-diabetes-500">
              Add to Home Screen
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
