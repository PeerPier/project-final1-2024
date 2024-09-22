import { User } from "./user";

export type ReplyComment = {
  _id: string;
  content: string;
  author: User;
  created_at: Date;
};

export type Comment = {
  _id: string;
  author: User;
  content: string;
  replies: ReplyComment[];
  created_at: Date;
};
