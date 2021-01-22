import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { gql } from "graphql-request";
import { requestGraphQL } from "../services/graphQLService";
import { useHistory } from "react-router-dom";
import { CountryDropdown } from "react-country-region-selector";
import { Post } from "../types/PostTypes";

interface SidePanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addPost: (post: Post) => void;
}

const SidePanel: React.FC<SidePanelProps> = (props) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postFailure, setPostFailure] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [country, setCountry] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formObj, setFormObj] = useState({
    post: "",
  });

  const history = useHistory();
  const logout = () => {
    setIsLoggingOut(true);
    const query = gql`
      query logout {
        logout
      }
    `;
    requestGraphQL(true, query)
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggingOut(false);
        history.push("/");
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggingOut(false);
        history.push("/");
      });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setFormObj({
      ...formObj,
      [event.target.name]: event.target.value,
    });
  };

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFeedback(event.target.value);
  };

  const onFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!("user" in localStorage) || localStorage.getItem("user") === "")
      history.push("/");
    const userId = localStorage.getItem("user");
    const query = gql`
      mutation addFeedback {
        add_feedback(input: { content: "${feedback}", userId: "${userId}" }) {
          content
        }
      }
    `;
    requestGraphQL(true, query)
      .then(() => {
        setFeedbackSuccess(true);
        setFeedback("");
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);
    const postCountry = country ? country : "international";
    if (!("user" in localStorage) || localStorage.getItem("user") === "")
      history.push("/");
    const userId = localStorage.getItem("user");
    let post = formObj.post.replace(/(?:\r\n|\r|\n)/g, "\\n");
    const query = gql`
      mutation addPost {
        add_post(
          input: {
            content: "${post}"
            userId: "${userId}"
            country: "${postCountry}"
          }
        ) {
          _id
          content
          country
          likes
          user{
            _id
          }
        }
      }
    `;
    requestGraphQL(true, query)
      .then((data: any) => {
        setPostSuccess(true);
        setIsPosting(false);
        setTimeout(() => {
          setPostSuccess(false);
        }, 3000);
        const newPost: Post = data.add_post;
        props.addPost(newPost);
        setCountry("");
        setFormObj({ post: "" });
      })
      .catch((error) => {
        setPostFailure(true);
        setIsPosting(false);
        setTimeout(() => {
          setPostFailure(false);
        }, 3000);
      });
  };

  return (
    <Transition
      show={props.isOpen}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {(ref) => (
        <div ref={ref}>
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-70 transition-opacity"
            aria-hidden="true"
          ></div>
          <section
            className="absolute inset-y-0 right-0 pl-10 max-w-full flex"
            aria-labelledby="slide-over-heading"
          >
            <Transition.Child
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              {(ref) => (
                <div
                  ref={ref}
                  className="relative w-screen max-w-md min-h-full"
                >
                  <Transition.Child
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    {(ref) => (
                      <div
                        ref={ref}
                        className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4"
                      >
                        <button
                          name="Close Sidemenu"
                          onClick={() => props.setIsOpen(!props.isOpen)}
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <span className="sr-only">Close panel</span>
                          {/* <!-- Heroicon name: x --> */}
                          <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Transition.Child>

                  <div className="min-h-screen flex flex-col py-6 bg-white dark:bg-gray-800 shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <h2
                        id="slide-over-heading"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                      >
                        <button
                          type="button"
                          name="Logout"
                          className={
                            "px-4 py-2 font-semibold bg-gray-900 rounded text-white hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-800 dark:focus:bg-gray-700 " +
                            (isLoggingOut
                              ? "bg-gray-800 cursor-not-allowed"
                              : "")
                          }
                          onClick={logout}
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? (
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
                          Logout
                        </button>
                      </h2>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      {/* <!-- Replace with your content --> */}
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <div
                          className="h-full border-2 border-dashed border-gray-200"
                          aria-hidden="true"
                        >
                          <div className="max-w-4xl p-6 mx-auto bg-white dark:bg-gray-800 rounded-md shadow-md">
                            <h2 className="text-lg text-gray-700 dark:text-white font-semibold capitalize">
                              Add Post
                            </h2>

                            <form onSubmit={submitPost}>
                              <div className="grid grid-cols-1 gap-6 mt-4">
                                <div>
                                  <label
                                    className="text-gray-700 dark:text-gray-200"
                                    htmlFor="country"
                                  >
                                    Country (optional)
                                  </label>
                                  {/* <input
                                    id="username"
                                    type="text"
                                    className="mt-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded py-2 px-4 block w-full focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                  /> */}
                                  <CountryDropdown
                                    classes="w-full mt-2 px-4 py-3 leading-tight text-sm text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-900 rounded-md placeholder-gray-500 dark:placeholder-gray-200 border border-transparent focus:outline-none focus:bg-white focus:ring focus:border-blue-400"
                                    value={country}
                                    onChange={(val) => setCountry(val)}
                                  />
                                </div>

                                <div className="box rounded flex flex-col shadow  bg-gray-200 dark:bg-gray-900">
                                  <div className="box__title bg-grey-lighter px-3 py-2">
                                    <h3 className="text-sm dark:text-white text-gray-700 font-medium">
                                      Post
                                    </h3>
                                  </div>
                                  <textarea
                                    required
                                    rows={3}
                                    className="dark:text-white text-gray-700 p-2 m-1 bg-transparent border-none rounded-md outline-none focus:outline-none resize-y"
                                    name="post"
                                    onChange={(event) =>
                                      handleInputChange(event)
                                    }
                                    value={formObj.post}
                                    placeholder="Write your post here."
                                  >
                                    good bye
                                  </textarea>
                                </div>
                              </div>

                              <div className="flex justify-end mt-6">
                                {!postSuccess && !postFailure ? (
                                  <button
                                    type="submit"
                                    className={
                                      "bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-800 dark:focus:bg-gray-700 " +
                                      (isPosting
                                        ? "bg-gray-800 cursor-not-allowed"
                                        : "")
                                    }
                                    disabled={isPosting}
                                  >
                                    {isPosting ? (
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
                                    Post
                                  </button>
                                ) : postSuccess ? (
                                  <div className="flex max-w-xs md:w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                                    <div className="flex justify-center items-center w-12 bg-green-500">
                                      {/* <svg
                                        className="h-5 w-6 fill-current text-white"
                                        viewBox="0 0 40 40"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
                                      </svg> */}
                                      <svg
                                        className="h-5 w-6 fill-current text-white"
                                        viewBox="0 0 40 40"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                                      </svg>
                                    </div>

                                    <div className="-mx-3 py-2 px-4">
                                      <div className="mx-3">
                                        <span className="text-green-500 dark:text-green-400 font-semibold">
                                          Posted!
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : postFailure ? (
                                  <div className="flex max-w-xs md:w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                                    <div className="flex justify-center items-center w-12 bg-red-500">
                                      <svg
                                        className="h-5 w-6 fill-current text-white"
                                        viewBox="0 0 40 40"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                                      </svg>
                                    </div>

                                    <div className="-mx-3 py-2 px-4">
                                      <div className="mx-3">
                                        <span className="text-red-500 dark:text-red-400 font-semibold">
                                          Post Failed!
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </form>
                          </div>

                          <div className="flex mt-5 flex-col max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="">
                              <div className="py-6 px-6">
                                <h2 className="text-gray-700 dark:text-white text-lg font-bold">
                                  Send Feedback to{" "}
                                  <span className="text-blue-600 dark:text-blue-400">
                                    Dev
                                  </span>{" "}
                                </h2>

                                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                  Feedback is the key to improvement.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-center">
                              <form onSubmit={onFeedbackSubmit}>
                                <div className="flex w-full flex-col border dark:border-gray-600 overflow-hidden lg:flex-row">
                                  <input
                                    className="py-3 px-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-white outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:placeholder-transparent dark:focus:placeholder-transparent"
                                    type="text"
                                    name="feedback"
                                    placeholder="Enter feedback"
                                    aria-label="Enter feedback"
                                    onChange={(event) =>
                                      handleFeedbackChange(event)
                                    }
                                    value={feedback}
                                    required
                                  />

                                  <button
                                    type="submit"
                                    className="py-3 px-4 bg-gray-700 text-gray-100 text-xs font-medium tracking-wider uppercase hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="inline fill-current text-yellow-500 h-5 mr-2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z" />
                                    </svg>{" "}
                                    {feedbackSuccess ? "Sent" : "Send"}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- /End replace --> */}
                    </div>
                  </div>
                </div>
              )}
            </Transition.Child>
          </section>
        </div>
      )}
    </Transition>
  );
};

export default SidePanel;
