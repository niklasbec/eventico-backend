const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

//Private Route
const verify = require("./verifyToken");

//Joi Validation

const { createEventValidation, patchEventValidation, participateEventValidation } = require("../validation/validation")

//Get Event by String

//Get all public

router.get("/public", async (req, res) => {

  try {
    const publicEvents = await Event.find({ public: true })
    res.status(200).send(publicEvents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

router.get("/:id", async (req, res) => {
  body = req.body

  const title = req.params.id.split("-").join(" ")
  const getEvent = await Event.findOne({ title: title })

  try {
    if (!getEvent) {
      res.status(404).json({ message: "Event not found" })
    } else {
      res.status(200).json({ data: getEvent })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//New Event
router.post("/", verify, async (req, res) => {
  body = req.body;

  //validation with joi
  const { error } = createEventValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const uniqueTitle = await Event.findOne({ title: req.body.title })
  if (uniqueTitle) {
    res.status(400).json({ message: "An Event with that title already exists" })
  } else {
    const event = await new Event({
      title: body.title,
      organizerID: req.user._id,
      organizerName: req.user.name,
      organizerContact: req.user.email,
      eventDate: body.eventDate,
      eventDescription: body.eventDescription,
      eventLocation: body.eventLocation,
      eventPrice: body.eventPrice,
      public: body.public,
    })

    try {
      const addedEvent = await event.save()
      res.json(addedEvent)
    } catch (err) {
      res.json({ message: err.message })
    }
  }

});

//Update Event, you have to send location description and date

router.patch("/:id", verify, async (req, res) => {
  const body = req.body

  //validation with joi
  const { error } = patchEventValidation(body)
  if (error) return res.status(400).send(error.details[0].message)

  const getEvent = await Event.findOne({ _id: req.params.id })
  try {
    if (req.user._id == getEvent.organizerID) {
      const updated = await Event.update({ _id: req.params.id }, { $set: { eventDescription: req.body.eventDescription, eventLocation: req.body.eventLocation } })
      res.status(202).json({ updated: updated });
    } else {
      res.status(400).json({ message: "Not authed!" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Patch Event (adding participants)
router.patch("/participate/:id", async (req, res) => {

  //validation with joi
  const { error } = participateEventValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  id = req.params.id
  const newParticipant = { name: req.body.name, email: req.body.email, note: req.body.note }

  try {
    const event = await Event.findOne({ _id: id })
    if (!event) {
      res.status(404).json({ message: "Event doesn't exist" })
    }
    const updatedEvent = await Event.updateOne({ _id: id }, { $set: { participants: [...event.participants, newParticipant] } })
    res.status(201).json({ message: "updated" })
  } catch (err) {
    res.status(500).json({ message: err.message })
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

//release canvas 2

confirm/delete participants

*/