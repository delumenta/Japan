(() => {
  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true;

  let deferredPrompt = null;
  let installButton = null;
  let installToast = null;

  function ensureInstallUI(){
    // Floating install prompt intentionally disabled.
  }

  function showInstallButton(){
    // Installation remains available from the browser menu.
  }

  function hideInstallButton(){
    document.getElementById("travelPwaInstall")?.remove();
  }

  function showToast(message){
    console.info("Travel PWA:", message);
  }

  window.travelPWA = {
    isStandalone: isStandalone(),
    canInstall: false,

    async install(){
      if(isStandalone()){
        hideInstallButton();
        return true;
      }

      if(!deferredPrompt){
        showToast("Use Chrome menu → Install and create shortcut → Install.");
        return false;
      }

      const prompt = deferredPrompt;
      deferredPrompt = null;
      this.canInstall = false;
      hideInstallButton();

      await prompt.prompt();

      const choice = await prompt.userChoice;
      const accepted = choice?.outcome === "accepted";

      if(!accepted){
        return false;
      }

      return true;
    }
  };

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();

    deferredPrompt = event;
    window.travelPWA.canInstall = true;

    showInstallButton();

    window.dispatchEvent(
      new CustomEvent("travel:pwa-install-ready")
    );
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.travelPWA.canInstall = false;
    window.travelPWA.isStandalone = true;

    hideInstallButton();
    showToast("Travel installed successfully.");

    window.dispatchEvent(
      new CustomEvent("travel:pwa-installed")
    );
  });

  const registerServiceWorker = async () => {
    if(!("serviceWorker" in navigator)) return;

    try{
      const registration =
        await navigator.serviceWorker.register(
          "/Japan/service-worker.js",
          { scope:"/Japan/" }
        );

      await registration.update();
    }
    catch(error){
      console.warn("Travel PWA service worker:", error);
    }
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", () => {
      ensureInstallUI();

      if(deferredPrompt){
        showInstallButton();
      }
    }, { once:true });
  }
  else{
    ensureInstallUI();

    if(deferredPrompt){
      showInstallButton();
    }
  }

  if(document.readyState === "complete"){
    registerServiceWorker();
  }
  else{
    window.addEventListener("load", registerServiceWorker, { once:true });
  }
})();
