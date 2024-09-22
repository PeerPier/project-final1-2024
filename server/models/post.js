const mongoose = require("mongoose");

require("../models/user");
require("../models/comment");
require("../models/like");
require("../models/save");

// กำหนดโครงสร้างข้อมูลสำหรับโพสต์บล็อก
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: false,
    },
    category: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    contentWithImages: [
      {
        content: {
          type: String,
          required: true,
        },
        images: {
          type: [String],
          required: false,
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedPost",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
