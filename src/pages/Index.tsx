
import { ProfileProvider } from "@/context/ProfileContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkRequiredEnvVars } from "@/utils/env";

const Index = () => {
  // Initialize PWA features and check environment variables
  useEffect(() => {
    
    // Check for required environment variables
    const missingVars = checkRequiredEnvVars();
    if (missingVars.length > 0) {
      console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pastel-100/40 to-pastel-300/30 rounded-full blur-3xl -z-10 transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pastel-400/30 to-pastel-200/20 rounded-full blur-3xl -z-10 transform -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground">
                Your Personal Diabetes Management Companion
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Effortlessly create personalized schedules that fit your lifestyle and optimize your Type 2 diabetes management.
              </p>
              <div className="mt-8">
                <Button className="button-primary text-lg py-3 px-8" onClick={() => document.getElementById('scheduler')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get Started Now
                </Button>
              </div>
            </div>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
              <Card className="card-pastel">
                <CardContent className="pt-6">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">AI-Powered Scheduling</h3>
                  <p className="text-muted-foreground">
                    Our intelligent system creates optimal medication and exercise schedules based on your unique health profile.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-pastel">
                <CardContent className="pt-6">
                  <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-secondary-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Calendar Integration</h3>
                  <p className="text-muted-foreground">
                    Seamlessly sync your personalized schedule with Google Calendar for timely reminders and better adherence.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-pastel">
                <CardContent className="pt-6">
                  <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-accent-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Personalized Insights</h3>
                  <p className="text-muted-foreground">
                    Receive tailored recommendations based on your health data to optimize your diabetes management journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Helps Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl">How DiabetesAI Companion Helps You</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform is designed to simplify diabetes management while improving health outcomes through personalized care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 mt-10">
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-4">Medication Management</h3>
                <ul className="space-y-3">
                  {[
                    "Creates optimal medication schedules based on your specific prescriptions",
                    "Sends timely reminders to ensure you never miss a dose",
                    "Tracks medication effectiveness and suggests adjustments when needed",
                    "Helps manage multiple medications with ease"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-4">Activity Planning</h3>
                <ul className="space-y-3">
                  {[
                    "Recommends exercise routines optimized for blood glucose control",
                    "Adapts activities based on your preferences and health status",
                    "Schedules workouts at ideal times around your medication regimen",
                    "Gradually increases intensity as your fitness improves"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-foreground mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Scheduler Section */}
        <section id="scheduler" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl">Create Your Personalized Schedule</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Answer a few simple questions and our AI will generate a custom schedule tailored to your needs.
              </p>
            </div>
            
            <div className="relative z-10">
              <div className="hidden sm:block absolute -top-6 -right-6 -z-10">
                <div className="w-72 h-72 bg-pastel-200 rounded-full opacity-50 blur-3xl"></div>
              </div>
              
              <div className="hidden sm:block absolute -bottom-8 -left-8 -z-10">
                <div className="w-80 h-80 bg-pastel-400 rounded-full opacity-50 blur-3xl"></div>
              </div>
              
            </div>
          </div>
        </section>
        
        {/* Testimonials or Additional Info Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl">Why Patients Trust Us</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of patients who have improved their diabetes management with our AI-powered companion.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The medication schedule has helped me maintain consistent blood sugar levels for the first time in years.",
                  name: "Sarah L.",
                  role: "Type 2 Diabetes Patient"
                },
                {
                  quote: "I love how it integrates with my calendar. The reminders have made it so much easier to stay on track.",
                  name: "Michael T.",
                  role: "Living with Diabetes for 8 Years"
                },
                {
                  quote: "As a doctor, I recommend DiabetesAI to my patients because it helps them adhere to their treatment plans.",
                  name: "Dr. Jennifer K.",
                  role: "Endocrinologist"
                }
              ].map((testimonial, i) => (
                <Card key={i} className="card-pastel">
                  <CardContent className="pt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-10 h-10 text-primary/50 mb-4" viewBox="0 0 975.036 975.036">
                      <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                    </svg>
                    <p className="text-foreground italic mb-6">"{testimonial.quote}"</p>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <div id="pwa-install-prompt" className="fixed bottom-0 left-0 right-0 bg-card shadow-lg border-t border-border p-4 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-foreground">Install DiabetesAI Companion</h3>
            <p className="text-sm text-muted-foreground">Add to your home screen for quick access</p>
          </div>
          <button 
            id="pwa-install-button"
            className="button-primary py-2 px-4 rounded-md text-sm font-medium"
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
