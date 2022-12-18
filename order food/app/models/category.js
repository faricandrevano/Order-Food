const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('category', cateSchema)