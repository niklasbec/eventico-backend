const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

//Private Route
const verify = require("./verifyToken");

//New Event
router.post("/", verify, async (req, res) => {
  body = req.body;

  const event = await new Event({
    title: body.title,
    organizerID: req.user._id,
    organizerName: body.organizerName,
    organizerContact: body.organizerContact,
    eventDate: body.eventDate,
    eventDescription: body.eventDescription,
    eventLocation: body.eventLocation,
    eventPrice: body.eventPrice
  })

  try {
      const addedEvent = await event.save()
      res.json(addedEvent)
  } catch(err) {
      res.json({message: err})
  }
});

//Delete Event
router.delete("/:id", verify, async (req, res) => {
  id = req.params.id;

  const event = await Event.findOne({ _id: id });
  if (req.user._id == event.organizerID) {
    const deleted = await Event.deleteOne({ _id: id });
    res.status(202).json({ deleted: deleted });
  } else {
    res.status(401).json({ message: "Unauthorized!" });
  }
});

module.exports = router;
