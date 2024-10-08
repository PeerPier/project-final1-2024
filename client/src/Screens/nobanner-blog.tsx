import { Link } from "react-router-dom";
import { Post } from "../types/post";
import { getDay } from "../common/date";

interface BlogCardProps {
  blog: Post;
  index: number;
}

const MinimalBlogPost: React.FC<BlogCardProps> = ({ blog, index }) => {
  const {
    topic,
    blog_id: id,
    author: { fullname, username, profile_picture },
    publishedAt,
  } = blog;
  return (
    <Link to={`/blog/${id}`} className="blog-link d-flex gap-4 mb-4">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="d-flex gap-2 align-items-center mb-4">
          <img
            src={profile_picture}
            alt=""
            className=" rounded-circle"
            style={{ height: "24px", width: "24px" }}
          />
          <p
            className="m-0"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fullname} @{username}
          </p>
          <p className="w-auto m-0"> {getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{topic}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
