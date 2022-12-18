const moment = require('moment');
const Noty = require('noty');
const Order = require('../../../models/orders');
const User = require('../../../models/user');
require('dotenv').config({
	path: './.env'
})
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
// ubah default language menjadi indonesia
moment.locale('id');
async function user() {
    return User.find();
}
const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}


function orderController() {
	return {
		store(req, res) {
			// validate request
			const {
				phone: nomor,
				adress: alamat
			} = req.body;
			if (!nomor || !alamat) {
				return res.status(422).json({ message : 'All fields are required' });
				return res.redirect('/cart');
			}
			const order = new Order({
				customerId: req.user._id,
				items: req.session.cart.items,
				phone: nomor,
				adress: alamat
			})

			// save data ke collection
			order.save().then(result => {
				Order.populate(result,{path:'customerId'},(err,placeOrder)=> {

					// Stripe payment
                    // if(paymentType === 'card') {
                    //     stripe.charges.create({
                    //         amount: req.session.cart.totalPrice,
                    //         source: stripeToken,
                    //         currency: 'IDR',
                    //         description: `Pizza order: ${placedOrder._id}`
                    //     }).then(() => {
                    //         placedOrder.paymentStatus = true
                    //         placedOrder.paymentType = paymentType
                    //         placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', result)
                                delete req.session.cart
                                return res.redirect('/customer/orders/')
                            // }).catch((err) => {
                            //     console.log(err)
                            // })

                    //     }).catch((err) => {
                    //         delete req.session.cart
                    //         new Noty({
                    //         	type: 'error',
                    //         	timeout: 3000,
                    //         	progressbar: false,
                    //         	theme: 'metroui',
                    //         	killer: false,
                    //         	text: 'pembayaran gagal'
                    //         })
                    //         return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                    //     })
                    // } else {
                    //     delete req.session.cart
                    //     return res.json({ message : 'Order placed succesfully' });
                    // }

				})
			}).catch(err => {
				// jika gagal
				req.flash('error', 'ada yang error,coba lagi!')
				return res.redirect('/cart')
			})
		},
		async index(req, res) {
			// await hanya bisa dilakakukan jika suatu fungsi asyncronous
			const user = await User.find({_id:req.user._id})
			const orders = await Order.find({
				customerId: req.user._id,
			}, null, {
				sort: {
					// sortir data dari atas ke bawah
					'createdAt': -1
				}
			})
			console.log(orders)
			function renderImage(items) {
		        let parsedItems = Object.values(items);
		        return parsedItems.map((menuImage)=> {
		            return `<img src="${menuImage.item.image}" width="30" class="block mb-4">`;
		        }).join('')
		      }
			function renderItemsQty(items) {
		        let parsedItems = Object.values(items)
		        return parsedItems.map((menuItem) => {
		            return `
		                <p class="mb-4">${ menuItem.qty}</p>
		            `
		        }).join('')
		      }
		      function renderItems(items) {
		        let parsedItems = Object.values(items)
		        return Array.from(parsedItems).map((menuItem) => {
		            return `
		                <p class="mb-4">${ menuItem.item.name }</p>
		            `
		        }).join('')
		      }
		      function renderPrice(items) {
		        let parsedItems = Object.values(items)
		        return parsedItems.map((menuItem) => {
		            return `
		                <p class="mb-4">${ rupiah(menuItem.item.price)}</p>
		            `
		        }).join('')
		      }
			res.header('Cache-Control', 'no-store')
			// req.flash('success', 'Order Berhasil');
			res.render('customers/orders', {
				orders,
				moment,
				renderImage,
				renderItems,
				renderItemsQty,
				renderPrice,
				title: 'Order',
				page_name:'order',
				user
			});
		},
		async show(req,res,next) {
			const order = await Order.findById(req.params.id);
			const user = await User.find({_id:req.user._id})
			// auth user
			if(req.user._id.toString() === order.customerId.toString())  {
				res.render('customers/singleOrder',{order,title:'status order',page_name:'order',user})
			} else {
				res.redirect('/')
			}

		},
		async pagination(req,res,next) {
			
		}
	}
}
module.exports = orderController;