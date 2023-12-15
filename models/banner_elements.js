const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const bannerElementSchema = mongoose.Schema({
    image: {
        type: String,
    },
    image_path: {
        type: String,
    },
    text: {
        type: String,
    },
    font_size: {
        type: Number,
    },
    color: {
        type: String,
    },
    line_height: {
        type: Number,
    },
    font_weight: {
        type: Number,
    },
    data_x: {
        type: String,
    },
    data_y: {
        type: String,
    },
    data_start: {
        type: Number,
    },
    data_speed: {
        type: Number,
    },
    data_easing: {
        type: String,
    },
    data_endspeed: {
        type: Number,
    },
    banner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'banner',
    },
    customer_id: {
        type: Number,
    },
    type: {
        type: Number,
    },
    create_at: {
        type: Number,
    },
})
module.exports = mongoose.model('banner_elements', bannerElementSchema);