import { User } from "./user";
import { Comment } from "./comment";
import { Like } from "./like";
import { save } from "./save"; // ตรวจสอบว่าชื่อไฟล์เป็น Save หรือ save

export type ContentWithImages = {
  content: string;
  images: string[];
};

export interface Author {
  fullname: string;
  profile_picture: string;
  username: string;
}

export type Post = {
  _id: string;
  user: User;
  author: Author;
  comments: Comment[];
  likes: Like[];
  saves: save[];
  topic: string;
  detail: string;
  category: string[];
  image: string;
  images: string[];
  contentWithImages: ContentWithImages[];
  publishedAt: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isSaved?: boolean;
  tags: string;
  des: string;
  banner: string;
  activity: {
    total_likes: number;
  };
  blog_id: string;
};
