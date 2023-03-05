const mongoose = require("mongoose");

const availableRooms = new mongoose.Schema(
  {
    rno: Number,
    type: String,
    beds: Number,
  },
  {
    collection: "available_rooms",
  }
);

mongoose.model("available_rooms", availableRooms);
