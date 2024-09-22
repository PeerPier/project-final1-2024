const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const SavedPost = require("../models/save");
const auth = require("./authMiddleware");
const mongoose = require("mongoose");

router.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ message: "Query parameter is missing or not a string" });
  }

  try {
    const posts = await Post.find({
      $or: [
        { topic: new RegExp(query, "i") },
        { category: new RegExp(query, "i") },
        { content: new RegExp(query, "i") },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get("/search", async (req, res) => {
//   const query = req.query.query;
//   if (!query || typeof query !== "string") {
//     return res
//       .status(400)
//       .json({ message: "Query parameter is missing or not a string" });
//   }

//   try {
//     const posts = await Post.find({ $text: { $search: query } });
//     res.json(posts);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/", async (req, res) => {
  const { user, topic, detail, category, image, contentWithImages } = req.body;

  console.log("Request body:", req.body); // แสดงข้อมูลที่ได้รับ

  if (!user || !topic || !category || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const post = new Post({
      user,
      topic,
      detail,
      category,
      image,
      contentWithImages,
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error); // แสดงข้อผิดพลาดที่เกิดขึ้น
    res.status(500).json({ message: "Error creating post: " + error.message });
  }
});

// Middleware สำหรับการดึงโพสต์ตาม ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id)
      .populate("user")
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            model: "User",
          },
          {
            path: "replies",
            populate: {
              path: "author",
              model: "User",
            },
          },
        ],
      })
      .populate("likes");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.views += 1;
    await post.save();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding post: " + error.message });
  }

  res.post = post;
  next();
}

// ดึงข้อมูลโพสต์บล็อกทั้งหมด
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate("likes");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts: " + error.message });
  }
});

// ดึงข้อมูลโพสต์บล็อกตาม ID
router.get("/:id", getPost, (req, res) => {
  res.json(res.post);
});

router.patch("/:id", getPost, async (req, res) => {
  const { topic, detail, category, image, contentWithImages } = req.body;

  if (topic != null) res.post.topic = topic;
  if (detail != null) res.post.detail = detail;
  if (category != null) res.post.category = category;
  if (image != null) res.post.image = image;
  if (contentWithImages != null) res.post.contentWithImages = contentWithImages;

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post: " + error.message });
  }
});

// ลบข้อมูลโพสต์บล็อก
router.delete("/:id", auth, getPost, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!res.post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (res.post.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Comment.deleteMany({ post: res.post._id });
    await Like.deleteMany({ post: res.post._id });

    await Post.deleteOne({ _id: res.post._id });
    res.json({ message: "Deleted Post" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post: " + error.message });
  }
});

// เพิ่มหรือลบไลค์
router.post("/:id/likes", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      post.likes.pull(existingLike._id);
      await post.save();
      return res.status(200).json({ message: "Like removed successfully" });
    }

    const like = new Like({ user: userId, post: postId });
    const savedLike = await like.save();
    post.likes.push(savedLike._id);
    await post.save();
    res
      .status(201)
      .json({ message: "Like created successfully", like: savedLike });
  } catch (err) {
    res.status(500).json({ message: "Error handling like: " + err.message });
  }
});

// เพิ่มคอมเมนต์
router.post("/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const { content, author } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({ content, author, post: postId });
    const savedComment = await comment.save();
    post.comments.push(savedComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: savedComment });
  } catch (err) {
    res.status(500).json({ message: "Error creating comment: " + err.message });
  }
});

//ลบคอมเมนต์
router.delete("/:postId/comment/delete/:commentId", auth, async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    //ค้นหาคอมเมนต์
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    //ตรวจสอบว่าเป็นเจ้าของคอมเมนต์ไหม
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "ไม่สามรถลบได้ ผู้ใช้ไม่ถูกต้อง" });
    }

    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    //ลบคอมเมนต์จากฐานข้อมูล
    await comment.deleteOne();
    res.status(200).json({ message: "ลบความคิดเห็นสำเร็จ" });
  } catch (error) {
    console.error("ข้อผิดพลาดในการลบความคิดเห็น :", error);
    res
      .status(500)
      .json({ message: "ข้อผิดพลาดในการลบความคิดเห็น :" + error.message });
  }
});

const addReplyComment = async (commentId, reply) => {
  try {
    // ตรวจสอบการมีอยู่ของความคิดเห็น
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("ไม่พบความคิดเห็น");
    }

    // ตรวจสอบว่า reply มีข้อมูลหรือไม่
    if (!reply || !reply.content || !reply.author) {
      throw new Error("ข้อมูลการตอบกลับไม่ถูกต้อง");
    }

    // เพิ่มการตอบกลับ
    comment.replies.push(reply);

    // บันทึกความคิดเห็นที่อัปเดต
    await comment.save();

    return comment;
  } catch (err) {
    console.error("ข้อผิดพลาดในการเพิ่มการตอบกลับความคิดเห็น:", err.message);
    throw new Error("ข้อผิดพลาดในการเพิ่มการตอบกลับความคิดเห็น");
  }
};

//การตอบกลับความคิดเห็น
router.post("/:postId/comment/:commentId/reply", auth, async (req, res) => {
  const { postId, commentId } = req.params;
  const { content, author } = req.body;

  if (!content || !author) {
    return res.status(400).json({ message: "Content and author are required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "ไม่พบบล็อก" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "ไม่พบความคิดเห็น" });
    }

    //สร้างการตอบกลับ
    const reply = { content, author, created_at: new Date() };

    const updateComment = await addReplyComment(commentId, reply);

    res.status(201).json({
      message: "ตอบกลับสำเร็จ",
      updateComment,
    });
  } catch (err) {
    console.error("ข้อผิดพลาดในการตอบกลับความคิดเห็น: ", err);
    res
      .status(500)
      .json({ message: "ข้อผิดพลาดในการตอบกลับความคิดเห็น: " + err.message });
  }
});

// การลบการตอบกลับความคิดเห็น
router.delete("/:postId/comment/:commentId/reply/:replyId", auth, async (req, res) => {
  const { postId, commentId, replyId } = req.params;

  try {
    // ค้นหาโพสต์ที่มี postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "ไม่พบบล็อก" });
    }

    // ค้นหาคอมเมนต์ที่มี commentId
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "ไม่พบความคิดเห็น" });
    }

    // กรองการตอบกลับที่ต้องการลบออกจาก replies ของคอมเมนต์นี้
    comment.replies = comment.replies.filter(
      (reply) => reply._id.toString() !== replyId
    );

    // บันทึกคอมเมนต์ที่อัปเดต
    await comment.save();

    res.status(200).json({
      message: "ลบการตอบกลับสำเร็จ",
      updatedComment: comment,
    });
  } catch (err) {
    console.error("ข้อผิดพลาดในการลบการตอบกลับความคิดเห็น: ", err);
    res
      .status(500)
      .json({ message: "ข้อผิดพลาดในการลบการตอบกลับความคิดเห็น: " + err.message });
  }
});


// ดึงข้อมูลโพสต์ที่ถูกใจตาม User ID
router.get("/likedPosts/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // ดึงข้อมูลไลค์ที่เกี่ยวข้องกับ userId
    const likes = await Like.find({ user: userId }).populate("post");

    // ดึงข้อมูลโพสต์ที่เกี่ยวข้องกับไลค์
    const likedPosts = likes.map((like) => like.post);

    if (!likedPosts || likedPosts.length === 0) {
      return res.status(404).json({ message: "Liked posts not found" });
    }

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ฟังก์ชันบันทึกโพสต์
router.post("/:id/save", async (req, res) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.id;

    const existingSavedPost = await SavedPost.findOne({
      user: userId,
      post: postId,
    });

    if (existingSavedPost) {
      await SavedPost.deleteOne({ user: userId, post: postId });

      // Remove the save reference from the post
      await Post.findByIdAndUpdate(postId, {
        $pull: { saves: existingSavedPost._id },
      });

      return res.status(200).json({ success: true, message: "Post unsaved" });
    } else {
      const savedPost = new SavedPost({
        user: userId,
        post: postId,
      });
      await savedPost.save();

      // Add the save reference to the post
      await Post.findByIdAndUpdate(postId, {
        $push: { saves: savedPost._id },
      });

      return res.status(201).json({ success: true, message: "Post saved" });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ success: false, message: "Error saving post" });
  }
});

router.get("/saved/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const savedPosts = await SavedPost.find({ user: userId }).populate("post");

    res.status(200).json(savedPosts.map((savedPost) => savedPost.post));
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching saved posts" });
  }
});

router.delete("/:postId/save", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  try {
    const savedPost = await SavedPost.findOneAndDelete({
      user: userId,
      post: postId,
    });
    if (!savedPost) {
      return res.status(404).send({ error: "Save not found" });
    }

    // อัพเดตโพสต์ให้ลบ reference ของ savedPost
    await Post.findByIdAndUpdate(postId, {
      $pull: { saves: savedPost._id },
    });

    res.status(200).send({ message: "Save removed successfully" });
  } catch (error) {
    console.error("Error removing save:", error);
    res.status(500).send({ error: "Failed to remove save" });
  }
});

module.exports = router;
