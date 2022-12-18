const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: false
    },
    kodeMenu: {
        type: String,
        required: true
    },
    categori: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required:true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('menus', menuSchema)