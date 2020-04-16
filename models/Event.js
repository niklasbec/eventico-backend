const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 100,
    },
    organizerID: {
        type: String,
        required: true,
    },
    organizerName: {
        type: String,
        required: true,
    },
    organizerContact: {
        type: String,
        required: true,
    },
    // Still need to decide here how to save dates!
    eventDate: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        max: 1000,
        default: "There is no description for this event"
    },
    eventLocation: {
        type: String,
        max: 100,
        required: true,
    },
    eventPrice: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model("Event", eventSchema)