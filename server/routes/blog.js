const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Blog = require("../models/blog");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(401).json({ error: "ไม่มี token การเข้าถึง" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "การเข้าถึง token ไม่ถูกต้อง" });
    }

    req.user = user.id;
    next();
  });
};

router.post("/", verifyJWT, (req, res) => {
  const { nanoid } = require("nanoid");
  let authorId = req.user;
  let { topic, des, banner, tags, content, draft } = req.body;

  if (!topic || topic.length === 0) {
    return res.status(403).json({ error: "คุณต้องระบุชื่อบล็อก" });
  }

  if (!draft) {
    if (!des || des.length === 0 || des.length > 200) {
      return res
        .status(403)
        .json({ error: "คุณต้องอธิบายบล็อกต่ำกว่า 200 ตัวอักษร" });
    }

    if (!banner || banner.length === 0) {
      return res
        .status(403)
        .json({ error: "คุณต้องใส่หน้าปกเพื่อเผยแพร่บล็อก" });
    }

    // ตรวจสอบ content.blocks
    console.log("Content blocks:", content.blocks);

    if (
      !content ||
      !content.blocks ||
      !Array.isArray(content.blocks) ||
      !content.blocks.length
    ) {
      return res.status(403).json({ error: "ต้องมีเนื้อหาบล็อกเพื่อเผยแพร่" });
    }

    if (!tags || tags.length === 0 || tags.length > 10) {
      return res
        .status(403)
        .json({ error: "ใส่แท็กในรายการเพื่อเผยแพร่บล็อก สูงสุด 10 แท็ก" });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    topic
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  let blog = new Blog({
    topic,
    des,
    banner,
    content: content.blocks,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;
      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { blogs: blog._id },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "ข้อผิดพลาดในการอัพเดตเลขจำนวนโพสต์" });
        });
    })
    .catch((err) => {
      console.error("Error occurred:", err);
      return res.status(500).json({
        error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        details: err.message,
      });
    });
});

router.post("/get-blog", (req, res) => {
  let { blog_id } = req.body;

  let incrementVal = 1;

  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementVal } }
  )
    .populate("author", "fullname username profile_picture")
    .select("topic des content banner activity publishedAt blog_id tags")
    .then((blog) => {
      return res.status(200).json({ blog });
    })
    .catch(err => {
      return res.status(500).json({"error": err.message})
    })
});

module.exports = router;
