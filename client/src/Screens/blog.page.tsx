import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/post";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import AnimationWrapper from "./page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "./blog-interaction";
import { Post } from "../types/post";
import "../misc/blogpage.css";
import BlogCard from "../components/blogpost.component";
import BlogContent from "../components/blog.content.component";

interface BlogContextType {
  blog: Partial<Post>;
  setBlog: Dispatch<SetStateAction<Partial<Post>>>;
}

export const BlogState: Partial<Post> = {
  blog_id: "",
  topic: "",
  des: "",
  content: [
    {
      blocks: [],
      time: 0,
      version: "",
    },
  ],
  author: {
    fullname: "",
    username: "",
    profile_picture: "",
  },
  banner: "",
  publishedAt: "",
  activity: {
    total_likes: 0,
    total_comments: 0,
  },
};

export const BlogContext = createContext<BlogContextType | undefined>(
  undefined
);

const BlogPage = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(BlogState);
  const [similarBlogs, setSimilarBlogs] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  let { topic, content, banner, author, publishedAt } = blog;

  const fullname = author?.fullname || "Unknown Author";
  const author_username = author?.username || "Unknown Username";
  const profile_picture = author?.profile_picture || "";

  const fetchBlog = () => {
    axios
      .post(API_BASE_URL + "/create-blog/get-blog", { blog_id })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        console.log(blog.content);
        axios
          .post(API_BASE_URL + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState = () => {
    setBlog(BlogState);
    setSimilarBlogs(null);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider value={{ blog, setBlog }}>
          <div className="blogpage">
            <img src={banner} alt="banner" style={{ aspectRatio: "16/9" }} />

            <div className="mt-2">
              <h2 className="mt-4 fs-3">{topic}</h2>

              <div className="detail-user d-flex  justify-content-between my-4">
                <div className="d-flex gap-2 align-items-start">
                  <img
                    src={profile_picture}
                    alt=""
                    className="rounded-circle"
                    style={{ width: "3rem", height: "3rem" }}
                  />

                  <p className="m-0" style={{ textTransform: "capitalize" }}>
                    {fullname}
                    <br />@
                    <Link
                      to={`/user/${author_username}`}
                      className="underline "
                      style={{ color: "inherit" }}
                    >
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="m-0 published-detail">
                  เผยแพร่เมื่อ:{" "}
                  {publishedAt ? getDay(publishedAt) : "ไม่ทราบวันที่"}
                </p>
              </div>
            </div>

            <BlogInteraction />

            <div className="my-4 blog-page-content">
              {content &&
              Array.isArray(content[0].blocks) &&
              content[0].blocks.length > 0 ? (
                content[0].blocks.map((block, i) => (
                  <div key={i} className="my-2 md:my-8">
                    <BlogContent block={block} />
                  </div>
                ))
              ) : (
                <p>No content available</p>
              )}
            </div>

            <BlogInteraction />
            {similarBlogs !== null && similarBlogs.length ? (
              <>
                <h1 className="mt-4 mb-2 fw-medium fs-4">บล็อกที่คล้ายกัน</h1>
                {similarBlogs.map((blog, i) => {
                  const author = blog.author || {
                    fullname: "Unknown Author",
                    username: "unknown",
                    profile_picture: "default_profile_picture_url",
                  };

                  const {
                    fullname,
                    username: author_username,
                    profile_picture,
                  } = author;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogCard
                        content={blog}
                        author={{
                          fullname,
                          username: author_username,
                          profile_picture,
                        }}
                      />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
