
/*import { registerSW } from "virtual:pwa-register";

// Simple function to check if the app is being used in standalone mode (PWA installed)
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}

// Function to register service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  }
}

// Function to display add to home screen prompt
export function setupInstallPrompt() {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install button if available
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.classList.remove('hidden');
      
      installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
          
          // Hide the install button
          installButton.classList.add('hidden');
        });
      });
    }
  });
  
  // Hide install button when PWA is installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.classList.add('hidden');
    }
  });
}
*/