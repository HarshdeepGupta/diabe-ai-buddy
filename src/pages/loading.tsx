
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { langGraphService } from "@/services/langGraphService";
import { isLangGraphEnabled } from "@/utils/env";

export default function Loading() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkServices() {
      try {
        // Check if LangGraph is enabled and if so, check its status
        if (isLangGraphEnabled()) {
          const isBackendAvailable = await langGraphService.checkStatus();
          if (!isBackendAvailable) {
            setStatus("error");
            setErrorMessage("Could not connect to the LangGraph backend service. Please check your connection and backend service status.");
            return;
          }
        }
        
        // All checks passed
        setStatus("ready");
      } catch (error) {
        console.error("Service initialization error:", error);
        setStatus("error");
        setErrorMessage("There was a problem initializing the application services.");
      }
    }
    
    checkServices();
  }, []);
  
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold">Initializing DiaBuddy</h2>
          <p className="text-muted-foreground mt-2">Loading application services...</p>
        </div>
      </div>
    );
  }
  
  if (status === "error") {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Initialization Error</CardTitle>
            <CardDescription>There was a problem starting DiaBuddy</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{errorMessage || "Unknown error occurred. Please try again."}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Should not reach here directly as we would be redirected to the app
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Ready!</h2>
        <p className="text-muted-foreground mt-2">Redirecting to DiaBuddy...</p>
      </div>
    </div>
  );
}
