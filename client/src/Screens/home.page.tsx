import AnimationWrapper from "./page-animation";
import InPageNavigation from "./Inpage-navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./loader.component";
import { Post } from "../types/post";
import BlogCard from "./blogpost.component";

const HomePage = () => {
  const API_URL = "http://localhost:3001";
  const [blogs, setBlogs] = useState<Post[] | null>(null);

  const fetchLatestBlogs = () => {
    axios
      .get(API_URL + "/posts/latest-blog")
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
  });

  return (
    <AnimationWrapper>
      <section
        className="h-cover d-flex justify-content-center"
        style={{ gap: "2.5rem" }}
      >
        <div className="w-100">
          <InPageNavigation
            routes={["หน้าหลัก", "บล็อกยอดนิยม"]}
            defaultHidden={["บล็อกยอดนิยม"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogCard content={blog} author={blog.author} />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
            <h1>ที่นี่บล็อกยอดนิยม</h1>
          </InPageNavigation>
        </div>
        <div className=""></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
