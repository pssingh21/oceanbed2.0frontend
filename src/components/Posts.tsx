import { gql } from "graphql-request";
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { requestGraphQL } from "../services/graphQLService";
import { Post } from "../types/PostTypes";
import Report from "./Report";
import Delete from "./Delete";
import Like from "./Like";

interface PostsProps {}

export interface RefObject {
  selectCountry: (country: string) => void;
  appendNewPost: (post: Post) => void;
}

const Posts = forwardRef((_props: PostsProps, ref: Ref<RefObject>) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadAllPosts();
  }, []);

  useImperativeHandle(ref, () => ({
    selectCountry(country: string) {
      loadByCountry(country);
    },
    appendNewPost(post: Post) {
      setPosts([post, ...posts]);
    },
  }));

  const loadByCountry = (country: string) => {
    const query = gql`
      query getPostsByCountry {
        get_posts_by_country(input: { country: "${country}" }) {
          data {
            _id
            content
            country
            likes
            user {
              _id
            }
          }
        }
      }
    `;
    sendQuery(query);
  };

  const loadAllPosts = () => {
    const query = gql`
      query getAllPosts {
        get_all_posts {
          data {
            _id
            content
            country
            likes
            user {
              _id
            }
          }
        }
      }
    `;
    sendQuery(query);
  };

  const loadPostByUser = (userId: string) => {
    const query = gql`
      query getPostsByUser {
        get_posts_by_user(input: { userId: "${userId}" }) {
          data {
            _id
            content
            country
            likes
            user {
              _id
            }
          }
        }
      }
    `;
    sendQuery(query);
  };

  const onPostDelete = (id: string) => {
    setPosts(
      posts.filter((post) => {
        return post._id !== id;
      })
    );
  };

  const setLikes = (postId: string, likes: number) => {
    const query = gql`
      mutation addLikes {
        add_likes(input: { postId: "${postId}", likes: ${likes} }) {
          likes
        }
      }
    `;
    requestGraphQL(true, query).then(() => {
      setPosts(
        posts.map((post) => {
          if (postId === post._id) {
            return {
              ...post,
              likes: likes,
            };
          }
          return post;
        })
      );
    });
  };

  const sendQuery = (query: string) => {
    requestGraphQL(true, query)
      .then((data: any) => {
        const posts: [Post] =
          data.get_all_posts?.data ||
          data.get_posts_by_user?.data ||
          data.get_posts_by_country?.data;
        const reversedPosts = posts.reverse();
        setPosts(reversedPosts);
        localStorage.setItem("posts", JSON.stringify(reversedPosts));
      })
      .catch((error) => {
        const cache: [Post] = JSON.parse(
          localStorage.getItem("posts") as string
        );
        setPosts(cache);
        console.log("error", error);
      });
  };

  const renderPosts = () => {
    const userId = localStorage.getItem("user");
    return posts.map((post, key) => {
      return (
        <div
          key={`${key}${post._id}`}
          className="mt-5 max-w-screen-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-4 py-2">
            <h1 className="text-gray-800 dark:text-white text-lg whitespace-pre-line">
              {post.content}
            </h1>
            <a
              className="text-gray-600 dark:text-gray-400 text-sm mt-1"
              onClick={() => loadPostByUser(post.user._id)}
              href="#"
            >
              Visit Profile
            </a>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-gray-500 dark:bg-gray-900">
            <Like
              postId={post._id}
              likes={post.likes}
              setLikes={setLikes}
              key={post._id}
            />{" "}
            {userId === post.user._id ? (
              <Delete
                postId={post._id}
                id={post._id}
                onPostDelete={onPostDelete}
                key={`${post._id}${key}`}
              />
            ) : (
              <Report postId={post._id} key={key} />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-grow mt-12 py-5 bg-gray-200 dark:bg-gray-800">
      {renderPosts()}
    </div>
  );
});

export default Posts;
