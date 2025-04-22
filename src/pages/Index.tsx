
import { ProfileProvider } from "@/context/ProfileContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiabetesScheduler from "@/components/DiabetesScheduler";
import { useEffect } from "react";
import { registerServiceWorker, setupInstallPrompt } from "@/utils/pwa";

const Index = () => {
  // Initialize PWA features
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Set up install prompt
    setupInstallPrompt();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-diabetes-800">Your Personalized Diabetes Management</h2>
            <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
              Create a customized schedule for your medication and exercise routine optimized for your Type 2 diabetes management.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="hidden sm:flex justify-center sm:block absolute -top-6 -right-6 -z-10">
              <div className="w-72 h-72 bg-diabetes-100 rounded-full opacity-70 blur-3xl"></div>
            </div>
            
            <div className="hidden sm:flex justify-center sm:block absolute -bottom-8 -left-8 -z-10">
              <div className="w-80 h-80 bg-health-100 rounded-full opacity-70 blur-3xl"></div>
            </div>
            
            <ProfileProvider>
              <DiabetesScheduler />
            </ProfileProvider>
          </div>
          
          <div className="mt-12 py-8 border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-diabetes-800 mb-4">About DiabetesAI Companion</h3>
              <p className="text-gray-700 mb-4">
                Our AI-powered assistant helps Type 2 diabetes patients create personalized schedules for medication and exercise, 
                automatically syncing with your Google Calendar for seamless integration into your daily routine.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg text-diabetes-700 mb-2">Personalized Schedule</h4>
                  <p className="text-gray-600 text-sm">AI-generated schedules tailored to your specific needs and preferences.</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg text-diabetes-700 mb-2">Calendar Integration</h4>
                  <p className="text-gray-600 text-sm">Seamlessly add events to your Google Calendar with reminders and details.</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg text-diabetes-700 mb-2">Offline Access</h4>
                  <p className="text-gray-600 text-sm">Install as a PWA for offline access to your schedule and information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div id="pwa-install-prompt" className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">Install DiabetesAI Companion</h3>
            <p className="text-sm text-gray-600">Add to your home screen for quick access</p>
          </div>
          <button 
            id="pwa-install-button"
            className="bg-diabetes-600 hover:bg-diabetes-700 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Install
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
