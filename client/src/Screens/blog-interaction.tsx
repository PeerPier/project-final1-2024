import { useContext } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { BlogContext } from "./blog.page";

const BlogInteraction = () => {
  const blogContext = useContext(BlogContext);
  const userContext = useContext(UserContext);

  if (!blogContext || !userContext) {
    return null;
  }

  const {
    blog: { topic, blog_id, activity, author },
    setBlog,
  } = blogContext;

  const total_likes = activity ? activity.total_likes : 0;
  const total_comments = activity ? activity.total_comments : 0;
  const author_username = author ? author.username : "Unknown";

  const {
    userAuth: { username },
  } = userContext;

  return (
    <>
      <hr className="border-grey my-2" />

      <div className="d-flex gap-2 justify-content-between">
        <div className="d-flex gap-2 align-items-center">
          <button
            className="rounded-circle d-flex align-items-center justify-content-center "
            style={{
              width: "2.5rem",
              height: "2.5rem",
              backgroundColor: "#f0f0f1",
            }}
          >
            <FaRegHeart />
          </button>
          <p className="m-0" style={{ color: "#494949" }}>
            {total_likes}
          </p>

          <button
            className="rounded-circle d-flex align-items-center justify-content-center "
            style={{
              width: "2.5rem",
              height: "2.5rem",
              backgroundColor: "#f0f0f1",
            }}
          >
            <FaRegCommentDots />
          </button>
          <p className="m-0" style={{ color: "#494949" }}>
            {total_comments}
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline text-purple"
              style={{
                color: "inherit",
              }}
            >
              แก้ไข
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${topic}&url=${window.location.href}`}
            style={{
              color: "inherit",
            }}
          >
            <FaTwitter className="text-twitter" />
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
