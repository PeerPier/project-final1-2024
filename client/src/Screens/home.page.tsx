import AnimationWrapper from "./page-animation";
import InPageNavigation from "./Inpage-navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./loader.component";
import { Post } from "../types/post";
import BlogCard from "./blogpost.component";
import MinimalBlogPost from "./nobanner-blog";
import { MdAutoGraph } from "react-icons/md";
import { activeTabRef } from "./Inpage-navigation";
import NoDataMessage from "./nodata.component";

const HomePage = () => {
  const API_URL = "http://localhost:3001";
  const [blogs, setBlogs] = useState<Post[] | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Post[] | null>(null);
  const [pageState, setPageState] = useState("หน้าหลัก");
  const category = [
    "มข",
    "กีฬา",
    "ข่าวสาร",
    "รับน้อง",
    "น้องใหม่",
    "รีวิว",
    "ร้านอาหาร",
    "Blog",
  ];

  const loadBlogBycategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    const categories = (
      e.currentTarget as HTMLButtonElement
    ).innerText.toLowerCase();
    setBlogs(null);

    if (pageState === categories) {
      setPageState("หน้าหลัก");
      return;
    }
    setPageState(categories);
  };

  const fetchLatestBlogs = (page = 1 ) => {
    axios
      .post(API_URL + "/posts/latest-blog", { page })
      .then(({ data }) => {
        console.log(data);
        // setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = () => {
    axios
      .post(API_URL + "/search-blogs", { tag: pageState })
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
    activeTabRef.current?.click();

    if (pageState === "หน้าหลัก") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section
        className="h-cover d-flex justify-content-center"
        style={{ gap: "2.5rem" }}
      >
        <div className="w-100">
          <InPageNavigation
            routes={[pageState, "บล็อกยอดนิยม"]}
            defaultHidden={["บล็อกยอดนิยม"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : blogs.length ? (
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
              ) : (
                <NoDataMessage message="ไม่มีบล็อกที่เผยแพร่" />
              )}
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : trendingBlogs.length ? (
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
            ) : (
              <NoDataMessage message="ไม่มีบล็อกที่ติดเทรนด์" />
            )}
          </InPageNavigation>
        </div>
        <div className="trending-blog">
          <div className="d-flex flex-column gap-3 ">
            <div>
              <h1 className="fw-medium mb-3 fs-5">เรื่องราวที่อาจสนใจ</h1>

              <div className="d-flex gap-3 flex-wrap">
                {category.map((categories, i) => {
                  return (
                    <button
                      onClick={loadBlogBycategory}
                      className={
                        "tag" +
                        (pageState === categories ? " changeColor" : " ")
                      }
                      key={i}
                    >
                      {categories}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="fw-medium mb-3 fs-5">
                Trending <MdAutoGraph />
              </h1>

              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
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
              ) : (
                <NoDataMessage message="ไม่มีบล็อกที่ติดเทรนด์" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
