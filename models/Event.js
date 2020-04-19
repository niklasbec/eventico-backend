const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4
    },
    email: {
        type: String,
        max: 255,
        min: 6
    },
    note: {
        type: String,
        max: 255,
    }
})

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 7,
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
    //FIX
    eventDate: {
        type: Date,
        default: Date.now()
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
    },
    public: {
        type: Boolean,
        default: false,
    },
    participants: [{
        name: {
            type: String,
            required: true,
            min: 4
        },
        email: {
            type: String,
            max: 255,
            min: 6
        },
        note: {
            type: String,
            max: 255,
        }
    }]
})

module.exports = mongoose.model("Event", eventSchema)