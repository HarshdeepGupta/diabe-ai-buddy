
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DiabetesAI Companion. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
