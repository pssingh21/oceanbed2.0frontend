import { useState, useEffect, useRef } from "react";
import Navigation from "./Navigation";
import SidePanel from "./SidePanel";
import Posts, { RefObject } from "./Posts";
import Footer from "./Footer";
import { Post } from "../types/PostTypes";

function About() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [selectedCountry, setselectedCountry] = useState("");

  const postsRef = useRef<RefObject>(null);

  const onCountryChange = (country: string) => {
    setselectedCountry(country);
    postsRef.current && postsRef.current.selectCountry(country);
  };

  const addPost = (post: Post): void => {
    postsRef.current && postsRef.current.appendNewPost(post);
  };

  return (
    <div>
      <div
        className={
          isOpen
            ? "fixed inset-0 overflow-hidden bg-gray-200 dark:bg-gray-800 shadow"
            : "h-screen"
        }
      >
        <div
          className={
            isOpen ? "absolute inset-0 overflow-hidden h-full" : "h-full"
          }
        >
          <div
            className={
              isOpen
                ? "flex flex-col absolute inset-0 overflow-hidden h-full"
                : "flex flex-col h-full"
            }
          >
            <Navigation
              mobileMenuIsOpen={mobileMenuIsOpen}
              selectedCountry={selectedCountry}
              setMobileMenuIsOpen={setMobileMenuIsOpen}
              onCountryChange={onCountryChange}
              setIsOpen={setIsOpen}
            />
            <Posts ref={postsRef} />
            <Footer />
            <SidePanel
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              addPost={addPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
