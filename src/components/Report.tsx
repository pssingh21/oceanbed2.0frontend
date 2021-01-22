import { gql } from "graphql-request";
import React, { useState } from "react";
import { requestGraphQL } from "../services/graphQLService";

interface ReportProps {
  postId: string;
}

const Report: React.FC<ReportProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportFailure, setReportFailure] = useState(false);

  const reportPost = (postId: string) => {
    setIsLoading(true);
    const query = gql`
      mutation reportPost {
        report_post(input: { postId: "${postId}" }) {
          content
        }
      }
    `;
    requestGraphQL(true, query)
      .then(() => {
        setReportSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          setReportSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        setReportFailure(true);
        setIsLoading(false);
        setTimeout(() => {
          setReportFailure(false);
        }, 3000);
      });
  };

  return (
    <>
      {!reportSuccess && !reportFailure ? (
        <button
          onClick={() => reportPost(props.postId)}
          className={
            "py-2 flex-grow max-w-xs px-2 py-1 bg-gray-200 text-xs text-black font-semibold rounded uppercase hover:bg-gray-200 focus:bg-gray-400 " +
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline fill-current text-yellow-500 h-5 mr-2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.31 7.526c-.099-.807.528-1.526 1.348-1.526.771 0 1.377.676 1.28 1.451l-.757 6.053c-.035.283-.276.496-.561.496s-.526-.213-.562-.496l-.748-5.978zm1.31 10.724c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
            </svg>
          )}{" "}
          Report
        </button>
      ) : reportSuccess ? (
        <div className="flex max-w-xs md:w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-center items-center w-12 bg-yellow-400">
            <svg
              className="h-5 w-6 fill-current text-white"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
            </svg>
          </div>

          <div className="-mx-3 py-2 px-4">
            <div className="mx-3">
              <span className="text-yellow-400 dark:text-yellow-300 font-semibold">
                Post reported!
              </span>
            </div>
          </div>
        </div>
      ) : reportFailure ? (
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
                Report Failed!
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Report;
