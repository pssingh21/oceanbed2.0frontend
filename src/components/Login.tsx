import { gql } from "graphql-request";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { requestGraphQL } from "../services/graphQLService";
import { BUTTON_STATE } from "../types/HomeTypes";

interface LoginProps {
  toggleButtonState: (buttonState: BUTTON_STATE) => void;
}

const INPUT_CSS =
  "w-full py-2 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded block placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring";

const Login: React.FC<LoginProps> = (props) => {
  const [formObj, setFormObj] = useState({
    username: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [submitFailure, setSubmitFailure] = useState(false);

  const history = useHistory();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormObj({
      ...formObj,
      [event.target.name]: event.target.value,
    });
  };

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    setIsLoggingIn(true);
    event.preventDefault();
    const queryLogin = gql`
      query loginUser {
        login_user(
          input: {
            username: "${formObj.username}"
            password: "${formObj.password}"
          }
        )
      }
    `;

    requestGraphQL(false, queryLogin)
      .then((data: any) => {
        localStorage.setItem("token", data.login_user);
        return data.login_user;
      })
      .then((token) => {
        const queryId = gql`
          query getUserId {
            get_user_id(input: "${token}")
          }
        `;
        return requestGraphQL(false, queryId);
      })
      .then((data: any) => {
        localStorage.setItem("user", data.get_user_id);
        setIsLoggingIn(false);
        history.push("/dashboard");
      })
      .catch((error) => {
        setIsLoggingIn(false);
        setSubmitFailure(true);
        setTimeout(() => {
          setSubmitFailure(false);
        }, 3000);
        console.log("error", error);
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white fo">
        Sign In
      </h2>

      <form onSubmit={submitForm}>
        <div className="mt-4">
          <input
            className={INPUT_CSS}
            type="text"
            placeholder="Username"
            aria-label="Username"
            onChange={(event) => handleInputChange(event)}
            name="username"
            required
          />
          <input
            className={"mt-4 " + INPUT_CSS}
            type="password"
            placeholder="Password"
            aria-label="Password"
            onChange={(event) => handleInputChange(event)}
            onKeyDown={(e) => {
              if (e.key === "Tab") e.preventDefault();
            }}
            name="password"
            required
          />
        </div>

        {!submitFailure ? (
          <div className="mt-4 flex items-center justify-between">
            <button
              className="text-gray-600 dark:text-gray-200 text-sm hover:underline"
              type="button"
              onClick={() => props.toggleButtonState(BUTTON_STATE.SIGN_UP)}
              name="Forgot Password"
            >
              Forget Password?
            </button>

            <button
              type="submit"
              name="Login"
              className={
                "px-4 py-2 font-semibold bg-gray-900 rounded text-white hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-800 dark:focus:bg-gray-700 " +
                (isLoggingIn ? "bg-gray-800 cursor-not-allowed" : "")
              }
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
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
              Login
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
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
                    Invalid Credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
