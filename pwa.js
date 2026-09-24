(() => {
  const standalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches
    ||
    window.navigator.standalone === true;

  let deferredPrompt = null;

  window.travelPWA = {
    isStandalone: standalone,
    canInstall: false,

    async install(){
      if(!deferredPrompt){
        return false;
      }

      const prompt = deferredPrompt;
      deferredPrompt = null;
      this.canInstall = false;

      await prompt.prompt();

      const choice =
        await prompt.userChoice;

      return choice?.outcome === "accepted";
    }
  };

  window.addEventListener(
    "beforeinstallprompt",
    event => {
      event.preventDefault();

      deferredPrompt =
        event;

      window.travelPWA.canInstall =
        true;

      window.dispatchEvent(
        new CustomEvent(
          "travel:pwa-install-ready"
        )
      );
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredPrompt = null;
      window.travelPWA.canInstall = false;

      window.dispatchEvent(
        new CustomEvent(
          "travel:pwa-installed"
        )
      );
    }
  );

  if(
    "serviceWorker"
    in navigator
  ){
    window.addEventListener(
      "load",
      async () => {
        try{
          const registration =
            await navigator.serviceWorker.register(
              "./service-worker.js",
              {
                scope:"./"
              }
            );

          registration.update();
        }
        catch(error){
          console.warn(
            "Travel PWA service worker:",
            error
          );
        }
      }
    );
  }
})();
