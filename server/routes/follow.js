const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { you: youId, me: meId } = req.body;

    const you = await User.findById(youId);
    const me = await User.findById(meId);

    if (!you || !me) {
      return res.status(404).json({ message: "User not found" });
    }

    let isUpdated = false;

    if (!you.followers.some((followerId) => followerId.equals(me._id))) {
      you.followers.push(me._id);
      isUpdated = true;
    }

    if (!me.following.some((followingId) => followingId.equals(you._id))) {
      me.following.push(you._id);
      isUpdated = true;
    }

    if (isUpdated) {
      await you.save();
      await me.save();
    }

    const checkFollowers = you.followers.some((followerId) =>
      followerId.equals(me._id)
    );

    const newFollow = { ...you.toObject(), if_followed: checkFollowers };

    res.status(200).json({ message: "Successfully added follower", newFollow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user data" });
  }
});

// Route URL to get user data by ID
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "firstname lastname")
      .populate("following", "firstname lastname");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const userData = req.body;
    const you = await User.findById(userData.you);
    const me = await User.findById(userData.me);

    if (you && me) {
      const checkUnFollowers = you.followers.pull(me._id);
      const checkUnFollowings = me.following.pull(you._id);
      await you.save();
      await me.save();
      const unFollow = { ...you.toObject(), if_unfollowed: checkUnFollowers };
      res.json({ message: "Successfully removed follower", unFollow });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting follower: " + error.message });
  }
});

module.exports = router;
