(() => {
  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)")?.matches
    ||
    window.navigator.standalone === true;

  let deferredPrompt = null;
  let installUI = null;

  function removeInstallUI(){
    if(installUI){
      installUI.remove();
      installUI = null;
    }
  }

  function showToast(message){
    let toast = document.getElementById("travelPwaToast");

    if(!toast){
      toast = document.createElement("div");
      toast.id = "travelPwaToast";

      Object.assign(toast.style,{
        position:"fixed",
        left:"50%",
        bottom:"calc(96px + env(safe-area-inset-bottom))",
        transform:"translateX(-50%)",
        zIndex:"10001",
        maxWidth:"calc(100vw - 32px)",
        padding:"11px 15px",
        border:"1px solid rgba(255,107,104,.35)",
        borderRadius:"999px",
        background:"rgba(10,16,21,.96)",
        color:"#f7f4ef",
        boxShadow:"0 14px 38px rgba(0,0,0,.38)",
        font:"700 11px/1.35 Inter,system-ui,sans-serif",
        letterSpacing:".01em",
        textAlign:"center",
        opacity:"0",
        transition:"opacity .18s ease"
      });

      document.body.appendChild(toast);
    }

    toast.textContent = message;

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.style.opacity = "0";

      setTimeout(() => {
        toast.remove();
      },220);
    },3200);
  }

  function showInstallUI(){
    if(
      isStandalone()
      ||
      !deferredPrompt
      ||
      installUI
      ||
      sessionStorage.getItem("travel_pwa_install_dismissed") === "1"
    ){
      return;
    }

    const wrap = document.createElement("div");
    wrap.id = "travelPwaInstall";

    Object.assign(wrap.style,{
      position:"fixed",
      right:"14px",
      bottom:"calc(88px + env(safe-area-inset-bottom))",
      zIndex:"10000",
      display:"flex",
      alignItems:"center",
      gap:"4px",
      padding:"4px",
      border:"1px solid rgba(255,107,104,.34)",
      borderRadius:"999px",
      background:"rgba(10,16,21,.94)",
      boxShadow:"0 16px 42px rgba(0,0,0,.42)",
      backdropFilter:"blur(14px)",
      WebkitBackdropFilter:"blur(14px)"
    });

    const installButton = document.createElement("button");
    installButton.type = "button";
    installButton.textContent = "INSTALL TRAVEL APP";
    installButton.setAttribute("aria-label","Install Travel app");

    Object.assign(installButton.style,{
      minHeight:"38px",
      padding:"0 13px",
      border:"0",
      borderRadius:"999px",
      background:"transparent",
      color:"#ff8c88",
      font:"900 9px/1 Inter,system-ui,sans-serif",
      letterSpacing:".12em",
      cursor:"pointer"
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label","Dismiss install button");

    Object.assign(closeButton.style,{
      width:"34px",
      height:"34px",
      padding:"0",
      border:"0",
      borderRadius:"50%",
      background:"rgba(255,255,255,.05)",
      color:"#9aa4ab",
      font:"400 20px/1 system-ui,sans-serif",
      cursor:"pointer"
    });

    installButton.addEventListener("click", async () => {
      installButton.disabled = true;
      installButton.textContent = "OPENING…";

      const accepted = await window.travelPWA.install();

      if(accepted){
        removeInstallUI();
        showToast("Travel installed. Look for “Travel” in your apps.");
      }
      else{
        installButton.disabled = false;
        installButton.textContent = "INSTALL TRAVEL APP";
      }
    });

    closeButton.addEventListener("click", () => {
      sessionStorage.setItem("travel_pwa_install_dismissed","1");
      removeInstallUI();
    });

    wrap.append(
      installButton,
      closeButton
    );

    document.body.appendChild(wrap);
    installUI = wrap;
  }

  window.travelPWA = {
    get isStandalone(){
      return isStandalone();
    },

    get canInstall(){
      return Boolean(deferredPrompt);
    },

    async install(){
      if(isStandalone()){
        return true;
      }

      if(!deferredPrompt){
        showToast("Chrome is not offering installation yet.");
        return false;
      }

      const prompt = deferredPrompt;
      deferredPrompt = null;

      await prompt.prompt();

      const choice = await prompt.userChoice;
      const accepted = choice?.outcome === "accepted";

      if(!accepted){
        window.dispatchEvent(
          new CustomEvent("travel:pwa-install-cancelled")
        );
      }

      return accepted;
    }
  };

  window.addEventListener(
    "beforeinstallprompt",
    event => {
      event.preventDefault();

      deferredPrompt = event;

      window.dispatchEvent(
        new CustomEvent("travel:pwa-install-ready")
      );

      if(document.readyState === "loading"){
        document.addEventListener(
          "DOMContentLoaded",
          showInstallUI,
          {once:true}
        );
      }
      else{
        showInstallUI();
      }
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredPrompt = null;
      removeInstallUI();

      window.dispatchEvent(
        new CustomEvent("travel:pwa-installed")
      );

      showToast("Travel has been installed.");
    }
  );

  window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.(
    "change",
    event => {
      if(event.matches){
        removeInstallUI();
      }
    }
  );

  if("serviceWorker" in navigator){
    window.addEventListener(
      "load",
      async () => {
        try{
          const registration =
            await navigator.serviceWorker.register(
              "./service-worker.js",
              {scope:"./"}
            );

          await registration.update();
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
