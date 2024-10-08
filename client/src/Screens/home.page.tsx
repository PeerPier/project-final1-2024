import AnimationWrapper from "./page-animation";
import InPageNavigation from "./Inpage-navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./loader.component";
import { Post } from "../types/post";
import BlogCard from "./blogpost.component";
import MinimalBlogPost from "./nobanner-blog";
import { MdAutoGraph } from "react-icons/md";

const HomePage = () => {
  const API_URL = "http://localhost:3001";
  const [blogs, setBlogs] = useState<Post[] | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Post[] | null>(null);

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

  const fetchTrendingBlogs = () => {
    axios
      .get(API_URL + "/posts/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
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
            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            )}
          </InPageNavigation>
        </div>
        <div className="trending-blog">
          <div className="d-flex flex-column gap-3 ">
            <h1 className="fw-medium mb-2 fs-4">เรื่องราวที่อาจสนใจ</h1>
          </div>

          <div>
            <h1 className="fw-medium mb-2 fs-5">
              Trending <MdAutoGraph />
            </h1>

            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
