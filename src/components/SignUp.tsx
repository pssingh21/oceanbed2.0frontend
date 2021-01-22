import React, { useState } from "react";
import { BUTTON_STATE } from "../types/HomeTypes";
import { CountryDropdown } from "react-country-region-selector";
import { gql } from "graphql-request";
import { requestGraphQL } from "../services/graphQLService";

interface SignUpProps {
  toggleButtonState: (buttonState: BUTTON_STATE) => void;
}

const INPUT_CSS =
  "w-full py-2 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded block placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring";

const COUNTRY_DIRTY_CSS =
  "mt-4 w-full py-2 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded block placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring";

const COUNTRY_PRISTINE_CSS =
  "mt-4 w-full py-2 px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded block placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring";

const SignUp: React.FC<SignUpProps> = (props) => {
  const [formObj, setFormObj] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailure, setSubmitFailure] = useState(false);

  const selectCountry = (val: string): void => {
    setFormObj({
      ...formObj,
      country: val,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormObj({
      ...formObj,
      [event.target.name]: event.target.value,
    });
  };

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const query = gql`
      mutation registerUser {
        register_user(
          input: {
            username: "${formObj.username}"
            password: "${formObj.password}"
            email: "${formObj.email}"
            country: "${formObj.country}"
          }
        ) {
          _id
          email
          role
          country
        }
      }
    `;

    requestGraphQL(false, query)
      .then(() => {
        setSubmitSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          setSubmitSuccess(false);
          props.toggleButtonState(BUTTON_STATE.SIGN_IN);
        }, 3000);
      })
      .catch((error) => {
        setSubmitFailure(true);
        setIsLoading(false);
        setTimeout(() => {
          setSubmitFailure(false);
        }, 3000);
        console.log("error", error);
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white fo">
        Sign Up
      </h2>

      <form onSubmit={submitForm}>
        <div className="mt-4">
          <input
            className={INPUT_CSS}
            type="text"
            placeholder="Username"
            aria-label="Username"
            name="username"
            onChange={(event) => handleInputChange(event)}
            required
          />
          <input
            className={"mt-4 " + INPUT_CSS}
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            name="email"
            onChange={(event) => handleInputChange(event)}
            required
          />
          <input
            className={"mt-4 " + INPUT_CSS}
            type="password"
            placeholder="Password"
            aria-label="Password"
            name="password"
            onChange={(event) => handleInputChange(event)}
            required
          />
          <CountryDropdown
            classes={
              formObj.country === "" ? COUNTRY_PRISTINE_CSS : COUNTRY_DIRTY_CSS
            }
            value={formObj.country}
            onChange={(val) => selectCountry(val)}
          />
        </div>

        <div className="mt-4 flex items-center justify-end">
          {!submitSuccess && !submitFailure ? (
            <button
              name="Sign Up"
              type="submit"
              className={
                "px-4 py-2 font-semibold bg-gray-900 rounded text-white hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-800 dark:focus:bg-gray-700 " +
                (isLoading ? "bg-gray-800 cursor-not-allowed" : "")
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="inline animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Sign Up
            </button>
          ) : submitSuccess ? (
            <div className="flex max-w-sm w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="flex justify-center items-center w-12 bg-green-500">
                <svg
                  className="h-6 w-6 fill-current text-white"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
              </div>

              <div className="-mx-3 py-2 px-4">
                <div className="mx-3">
                  <span className="text-green-500 dark:text-green-400 font-semibold">
                    Success
                  </span>
                  <p className="text-gray-600 dark:text-gray-200 text-sm">
                    Your account was registered!
                  </p>
                </div>
              </div>
            </div>
          ) : submitFailure ? (
            <div className="flex max-w-sm w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="flex justify-center items-center w-12 bg-red-500">
                <svg
                  className="h-6 w-6 fill-current text-white"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
              </div>

              <div className="-mx-3 py-2 px-4">
                <div className="mx-3">
                  <span className="text-red-500 dark:text-red-400 font-semibold">
                    Error
                  </span>
                  <p className="text-gray-600 dark:text-gray-200 text-sm">
                    User already exists!
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
