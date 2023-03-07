const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// db connection
require("./db/conn");

// schema
require("./model/bookedRooms");
require("./model/availableRooms");
require("./model/availRooms");
require("./model/roomBooked");

const app = express();

const booked_rooms = mongoose.model("booked_rooms");
const available_rooms = mongoose.model("available_rooms");
const avail_rooms = mongoose.model("avail_rooms");
const room_booked = mongoose.model("room_booked");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = 5000;

// to get all the data
app.get("/totalrooms", async (req, res) => {
  try {
    const allRooms = [];
    const available = await available_rooms.find({});
    const booked = await booked_rooms.find({});
    available.forEach((e) => {
      allRooms.push(e);
    });
    booked.forEach((e) => {
      allRooms.push(e);
    });

    res.send({ status: "ok", data: allRooms });
  } catch (e) {
    console.log(e);
  }
});

// get the filtered data
app.post("/findRoomsNumber", async (req, res) => {
  const type = String(req.body.type);
  const beds = Number(req.body.beds);
  const date = new Date(req.body.date);

  const availableRooms = [];

  const booked = await booked_rooms.find({
    $or: [{ sdate: { $lte: date } }, { edate: { $gte: date } }],
    type: type,
    beds: beds,
  });

  const available = await available_rooms.find({ type: type, beds: beds });
  available.forEach((e) => {
    availableRooms.push(e);
  });
  booked.forEach((e) => {
    availableRooms.push(e);
  });

  res.send("Rooms - " + availableRooms);
});

// new function according to the required modification
app.post("/findRooms", async (req, res) => {
  const s_date = new Date(req.body.sdate);
  const e_date = new Date(req.body.edate);
  const adults = Number(req.body.adults);
  const children = Number(req.body.children);

  var availableRooms = 0;
  const type = [];

  const booked = await room_booked.find({
    $or: [{ edate: { $lte: s_date } }, { sdate: { $gte: e_date } }],
    adults: { $gte: adults },
    children: { $gte: children },
  });

  const available = await avail_rooms.find({
    adults: { $gte: adults },
    children: { $gte: children },
  });

  available.forEach((e) => {
    availableRooms += e.available;
    type.push(e.type);
  });
  booked.forEach((e) => {
    availableRooms += 1;
    type.push(e.type);
  });

  const temp = new Set(type);
  const types = [...temp];

  if (availableRooms > 0) {
    res.send(
      "Total " +
        availableRooms +
        " are available of types: " +
        types.map((e) => e)
    );
  } else {
    res.send("Sorry no rooms available");
  }
});

// temp for adding data to the booked rooms for testing
app.post("/addData", async (req, res) => {
  const rno = Number(req.body.rno);
  const type = String(req.body.type);
  const beds = Number(req.body.beds);
  const sdate = new Date(req.body.sdate);
  const edate = new Date(req.body.edate);

  const result = await booked_rooms.create({
    rno: rno,
    type: type,
    beds: beds,
    sdate: sdate,
    edate: edate,
  });

  res.send("Room =>" + result);
});

// temp for adding data to the available rooms for testing
app.post("/addDataAvailable", async (req, res) => {
  const rno = Number(req.body.rno);
  const type = String(req.body.type);
  const beds = Number(req.body.beds);

  const result = await available_rooms.create({
    rno: rno,
    type: type,
    beds: beds,
  });

  res.send("Room =>" + result);
});

// temp for adding new objafter changes
app.post("/addDataAvail", async (req, res) => {
  const type = String(req.body.type);
  const adults = Number(req.body.adults);
  const children = Number(req.body.children);
  const available = Number(req.body.available);
  const booked = Number(req.body.booked);

  const result = await avail_rooms.create({
    type: type,
    adults: adults,
    children: children,
    available: available,
    booked: booked,
  });

  res.send("Room =>" + result);
});

// temp for adding new room_booked
app.post("/addDatabooked", async (req, res) => {
  const type = String(req.body.type);
  const sdate = new Date(req.body.sdate);
  const edate = new Date(req.body.edate);
  const adults = Number(req.body.adults);
  const children = Number(req.body.children);

  const result = await room_booked.create({
    type: type,
    sdate: sdate,
    edate: edate,
    adults: adults,
    children: children,
  });

  res.send("Room =>" + result);
});

app.listen(port, () => {
  console.log(`server Is Live at http://127.0.0.1:${port}`);
});
