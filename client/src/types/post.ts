import { User } from "./user";
import { Comment } from "./comment";
import { Like } from "./like";
import { save } from "./save"; // ตรวจสอบว่าชื่อไฟล์เป็น Save หรือ save

export type ContentWithImages = {
  content: string;
  images: string[];
};

export type Post = {
  _id: string;
  user: User;
  comments: Comment[];
  likes: Like[];
  saves: save[];
  topic: string;
  detail: string;
  category: string[];
  image: string;
  images: string[];
  contentWithImages: ContentWithImages[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isSaved?: boolean;
};
