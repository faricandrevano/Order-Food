const Menus = require('../../../models/menu');
const User = require('../../../models/user');
const Category = require('../../../models/category');
const cartController = require('../customers/cartController');
const fs = require('fs');
const moment = require('moment');
moment.locale('id');
// const multer = require('multer');

// const fs = require('fs')
function initCrud () {
	return {
		async getProductForm(req,res,next) {
			const dataCategory = await Category.find();
			const user = await User.find({_id:req.user._id})
			return res.render('admin/add-product',{title: 'Tambah Product',page_name:'menu',category:dataCategory,user});
		},
		async index(req,res,next) {
			const pizzas = await Menus.find();
			const user = await User.find({_id:req.user._id})
            return res.render('admin/listMenu', { pizzas: pizzas, title : 'List Menu', rupiah: cartController.rupiah,moment,user,page_name: 'menu' })
		},
		postProduct(req,res,next) {
			if(req.files) {
				console.log(req.files)
				var file = req.files.image;
				const path = `./public/img/${file.name}`
				// var filename = req.files.image.name;
				// var filename = file.name;
				console.log(req.files.image.name)
				file.mv(path,function(err){
					if(err) {
						console.log(err)
					} else {
						console.log('upload');
					}
				})
			}
			const menu = new Menus({
				name: req.body.name,
				price: req.body.price,
				image: file.name,
				categori: req.body.categori,
				desc: req.body.desc,
				kodeMenu : Math.floor(Math.random() * 99999)
			})
			menu.save().then(() => {
				return res.redirect('/admin/list-menu');
			}).catch(err => {console.log(err)})
		},
		async editProductPage(req,res,next) {
			const dataCategory = await Category.find();
			const user = await User.find({_id:req.user._id})
			Menus.findById(req.params.menuId)
	        .then(product => {
	            res.render('admin/edit-product', { menu:product,title: 'edit page',page_name:'menu',category:dataCategory,user});
	            console.log(product)
	        }).catch(err => console.log(err));
		},
		postEditProduct(req,res,next) {
			const image = req.files.image.name;
			const title = req.body.name;
			const price = req.body.price;
			const kategori = req.body.categori;
			const id = req.body.id;
			const desk = req.body.desc;
			// const size = req.body.size;
			// cek jika image sudah ada
			if(!image) {
				req.flash('error', 'Image not uploaded successfully or format is not correct.');
				res.redirect('/admin/edit-product')	
			}
			var file = req.files.image;
			const path = `./public/img/${file.name}`;
			file.mv(path,function(err){
					if(err) {
						console.log(err)
					} else {
						console.log('upload');
					}
				})

			Menus.findById(id)
		        .then(menu => {
		            menu.name = title;
		            menu.price = price;
		            menu.image = image;
		            menu.categori = kategori;
		            menu.desc = desk;
		            return menu.save();
		        })
		        .then(result => {
		            res.redirect('/admin/list-menu');
		        })
		        .catch((err) => {
		            // console.log(err)
		            req.flash('error', 'Something wrong happend.');
		            res.redirect('/admin/edit-product');
		        });

			// alternative update menu

			// Menus.updateOne({_id:req.body._id},{$set : {name: req.body.title,price: req.body.price, image: file.name}}).then( result => {
			// 	res.redirect('/admin/home')
			// }).catch(err => {
			// 	console.log(err)
			// })
		},
		removeProduct(req,res,next) {
			const id = req.params.kodeMenu;
			Menus.findOneAndDelete({kodeMenu:id}) //findAndModify
	        .then(result => {
	            res.redirect('/admin/list-menu');
	        })
	        .catch(err => console.log(err));

			}
	}
}
module.exports = initCrud;