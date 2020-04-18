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
    organizerName: req.user.name,
    organizerContact: req.user.email,
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

//Patch Event (adding participants)
router.patch("/participate/:id", async (req, res) => {
  id = req.params.id
  const newParticipant = {name: req.body.name, email: req.body.email, note: req.body.note}

  try {
    const event = await Event.findOne({_id: id})
    if (!event) {
      res.status(404).json({message: "Event doesn't exist"})
    }
    const updatedEvent = await Event.updateOne({_id: id}, {$set: {participants: [...event.participants, newParticipant]}})
    res.status(201).json({message: "updated"})
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

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


/*
deleteEvent
get event by string eventico.com/event/jensgardenparty
patch event description


//release canvas 2
confirm/delete participants
get all public events
*/