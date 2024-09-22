const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    entity: { type: mongoose.Schema.Types.ObjectId, refPath: "entityModel" },
    entityModel: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index(
  { user: 1, entity: 1, type: 1, entityModel: 1 },
  { unique: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
