const {
    json
} = require("express")
const Order = require('../../../models/orders');
    // generate mata uang rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}
const collectionName = 'sessions';
const User = require('../../../models/user');

function cartController() {
    return {
        async index(req, res) {

            if(req.user) {
            const user = await User.find({_id:req.user._id})
            res.header('Cache-Control', 'no-store');

            res.render('customers/cart', {
                title: 'Cart',
                rupiah,
                page_name:'',
                user
            })
        } else {
            res.render('customers/cart', {
                title: 'Cart',
                rupiah,
                page_name:''
            })

        }
            // console.log(req.body)
        },
        edit(req,res,next){
            req.session.cart.totalQty = req.session.cart.totalQty - req.session.cart.items[req.params.idMenu].qty;
            req.session.cart.items[req.params.idMenu].qty = parseInt(req.params.qty)
            // req.session.cart.items[req.params.idMenu].price = req.session.cart.items[req.params.idMenu].qty * req.session.cart.items[req.params.idMenu].price
            req.session.cart.totalPrice = req.session.cart.totalPrice - req.session.cart.items[req.params.idMenu].price;
            req.session.cart.items[req.params.idMenu].price = req.session.cart.items[req.params.idMenu].qty * req.params.dataPrice;
            req.session.cart.totalPrice = req.session.cart.totalPrice + req.session.cart.items[req.params.idMenu].price;
            req.session.cart.totalQty = req.session.cart.totalQty + req.session.cart.items[req.params.idMenu].qty;


          res.redirect('/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // buat struktur object cart
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            // console.log(cart)
            // console.log(cart.items[])

            // Check if item does not exist in cart 
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1,
                    price: 0
                    // price: cart.items[req.body._id].item.qty * cart.items[req.body._id].item.price
                }
                cart.items[req.body._id].price = cart.items[req.body._id].qty * req.body.price;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.items[req.body._id].price = cart.items[req.body._id].qty * req.body.price;
                // console.log(cart.items[req.body._id].qty)
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            // console.log(cart.items[req.body._id])
            // console.log(req.session.cart.items)
            return res.json({   
                totalQty: req.session.cart.totalQty
            })
        },
        removeItem(req, res, next) {
            // const cart = req.session.cart.items['5eee66cfa27a66807cf2bea7'];
            let cart = req.session.cart
            let data = req.body.data;
            cart.totalQty = cart.totalQty - cart.items[data].qty
            cart.totalPrice = cart.totalPrice - cart.items[data].price
            delete req.session.cart.items[data]
            // let priceSementara = req.body.price * cart.items[data].qty
            if(cart.totalPrice == 0) {
                delete req.session.cart
                console.log(req.session.cart)
                res.header('Cache-Control', 'no-store')
            }
            return res.redirect('/cart')
        },
        increaseItem(req,res,next) {

        },
        decreaseItem(req,res,next) {
            console.log(Object.values(sessions.cart.items.item.image))
        },
        removeAllItem(req,res,next) {
            delete req.session.cart
        }
    }
}

module.exports = {
    cartController,
    rupiah
};