import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { CountryDropdown } from "react-country-region-selector";

interface NavigationProps {
  mobileMenuIsOpen: boolean;
  selectedCountry: string;
  setMobileMenuIsOpen: (menuState: boolean) => void;
  onCountryChange: (country: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  return (
    <nav className="fixed w-full bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-6 py-3 md:flex">
        <div className="flex justify-between items-center">
          <div>
            <a
              className="text-gray-800 dark:text-white text-xl font-bold md:text-2xl hover:text-gray-700 dark:hover:text-gray-300"
              href="/dashboard"
            >
              Oceanbed
            </a>
          </div>

          {/* <!-- Mobile menu button --> */}
          <div className="flex md:hidden">
            <button
              id="navToggle"
              type="button"
              name="Toggle Menu"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
              onClick={() => props.setMobileMenuIsOpen(!props.mobileMenuIsOpen)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
        <div
          className={
            "w-full md:flex md:items-center md:justify-between " +
            (props.mobileMenuIsOpen ? "open" : "hidden")
          }
        >
          <div className="flex flex-col -mx-4 px-2 py-3 md:flex-row md:mx-0 md:py-0"></div>

          <div className="flex items-center -mx-2 mt-2 sm:mt-0 space-x-2">
            <CountryDropdown
              classes="w-2/3 px-4 py-3 leading-tight text-sm text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-900 rounded-md placeholder-gray-500 dark:placeholder-gray-200 border border-transparent focus:outline-none focus:bg-white focus:ring focus:border-blue-400"
              value={props.selectedCountry}
              onChange={(val) => props.onCountryChange(val)}
            />
            <DarkModeToggle />
            <button
              type="button"
              name="Toggle Sidemenu"
              className="flex items-center focus:outline-none"
              aria-label="toggle profile dropdown"
              onClick={() => props.setIsOpen(true)}
            >
              <div className="h-8 w-8 overflow-hidden rounded-full border-2  border-gray-400">
                <img
                  src={window.location.origin + "/avatar.png"}
                  className="h-full w-full object-cover"
                  alt="avatar"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
