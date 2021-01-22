import React, { useState } from "react";
import Footer from "./Footer";
import DarkModeToggle from "./DarkModeToggle";
import { BUTTON_STATE } from "./../types/HomeTypes";
import { useHistory } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import InstallPWA from "./InstallPWA";

const ACTIVE_BUTTON_CSS =
  "px-3 py-1 border-2 font-semibold rounded text-sm text-white hover:bg-gray-700";
const INACTIVE_BUTTON_CSS =
  "mx-2 px-3 py-2 font-semibold bg-black rounded text-sm text-white hover:bg-gray-800";

const Home: React.FC = () => {
  const [buttonState, setButtonState] = useState<BUTTON_STATE>(
    BUTTON_STATE.SIGN_IN
  );

  const toggleButtonState = (buttonState: BUTTON_STATE): void => {
    setButtonState(buttonState);
  };

  const getForm = () => {
    if (buttonState === BUTTON_STATE.SIGN_IN) {
      return <Login toggleButtonState={toggleButtonState} />;
    } else {
      return <SignUp toggleButtonState={toggleButtonState} />;
    }
  };

  const history = useHistory();

  const isAuthenticated =
    localStorage.getItem("token") && localStorage.getItem("user");

  if (isAuthenticated) history.push("/dashboard");

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-grow pattern bg-gray-900 mb-auto">
        <div className="container mx-auto px-6">
          <nav className="flex flex-col py-2 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <a
                href="/"
                className="text-2xl font-semibold text-white hover:text-gray-300"
              >
                Oceanbed
              </a>
              <InstallPWA />
            </div>

            <div className="flex items-center -mx-2 mt-2 sm:mt-0">
              <button
                name="Sign In"
                className={
                  buttonState === BUTTON_STATE.SIGN_IN
                    ? ACTIVE_BUTTON_CSS
                    : INACTIVE_BUTTON_CSS
                }
                onClick={() => toggleButtonState(BUTTON_STATE.SIGN_IN)}
              >
                Sign In
              </button>
              <button
                name="Sign Up"
                className={
                  buttonState === BUTTON_STATE.SIGN_UP
                    ? ACTIVE_BUTTON_CSS
                    : INACTIVE_BUTTON_CSS
                }
                onClick={() => toggleButtonState(BUTTON_STATE.SIGN_UP)}
              >
                Sign Up
              </button>
              <DarkModeToggle />
            </div>
          </nav>

          <div className="flex items-center flex-col py-6 md:h-128 md:flex-row">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-semibold text-gray-100">Oceanbed</h2>

              <h3 className="text-2xl font-semibold text-gray-100">
                <span className="text-indigo-400">We are</span>
              </h3>

              <p className="text-gray-100 mt-3">
                Anonymous. Authentic. Humane. Social. Respectful. Non-abusive.
              </p>
            </div>

            <div className="md:w-1/2 flex md:justify-end mt-8 md:mt-0">
              <div className="max-w-sm bg-white dark:bg-gray-800 rounded-lg">
                <div className="p-5 text-center">{getForm()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Footer />
    </div>
  );
};

export default Home;
