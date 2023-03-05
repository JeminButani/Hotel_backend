const mongoose = require("mongoose");

const availRooms = new mongoose.Schema(
  {
    type: String,
    adults: Number,
    children: Number,
    available: Number,
    booked: Number,
  },
  {
    collection: "avail_rooms",
  }
);

mongoose.model("avail_rooms", availRooms);
