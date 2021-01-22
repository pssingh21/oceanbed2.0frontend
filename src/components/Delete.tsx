import { gql } from "graphql-request";
import React, { useState } from "react";
import { requestGraphQL } from "../services/graphQLService";

interface DeleteProps {
  postId: string;
  id: string;
  onPostDelete: (id: string) => void;
}

const Delete: React.FC<DeleteProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);

  const deletePost = (postId: string) => {
    setIsLoading(true);
    const query = gql`
      mutation deletePost {
        delete_post(input: { postId: "${postId}" }) {
          content
        }
      }
    `;
    requestGraphQL(true, query)
      .then(() => {
        setDeleteSuccess(true);
        setIsLoading(false);
        props.onPostDelete(props.id);
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 1000);
      })
      .catch((_error) => {
        setDeleteFailure(true);
        setIsLoading(false);
        setTimeout(() => {
          setDeleteFailure(false);
        }, 3000);
      });
  };

  return (
    <>
      {!deleteSuccess && !deleteFailure ? (
        <button
          onClick={() => deletePost(props.postId)}
          className="py-2 flex-grow max-w-xs px-2 py-1 bg-gray-200 text-xs text-black font-semibold rounded uppercase hover:bg-gray-200 focus:bg-gray-400"
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
              className="inline fill-current text-red-500 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z" />
            </svg>
          )}{" "}
          Delete
        </button>
      ) : deleteSuccess ? (
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
                Post deleted!
              </span>
            </div>
          </div>
        </div>
      ) : deleteFailure ? (
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
                Deletion Failed!
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Delete;
