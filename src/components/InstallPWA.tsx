import React, { useEffect, useState } from "react";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    if (promptInstall) {
      promptInstall?.prompt();
    }
  };
  if (!supportsPWA) {
    return null;
  }

  return (
    <>
      {!window.matchMedia("(display-mode: standalone)").matches ? (
        <button
          className="link-button bg-blue-500 hover:bg-blue-700 text-white text-sm h-6 font-bold px-4 rounded-full ml-5"
          id="setup_button"
          aria-label="Install app"
          title="Install app"
          onClick={onClick}
        >
          Install
        </button>
      ) : null}
    </>
  );
};

export default InstallPWA;
