const Category = require('../../../models/category.js');
const User = require('../../../models/user');
var ObjectId = require('mongodb').ObjectID;

const moment = require('moment');
moment.locale('id');

function initCrud () {
	return {
		async index(req,res,next) {
			const category = await Category.find();
			const user = await User.find({_id:req.user._id})
			res.render('admin/listCategory',{title: "List Category",category,moment,user,page_name: 'category'})
		},
		async getForm(req,res,next) {
			const user = await User.find({_id:req.user._id})
			res.render('admin/add-category',{title: "Tambah Category",user,page_name: 'category'})
		},
		async postCategory(req,res,next) {
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
			const category = new Category({
				name: req.body.name,
				image: file.name,
				deskripsi: req.body.desc
			})
			category.save().then(() => {
				return res.redirect('/admin/list-category');
			}).catch(err => {console.log(err)})
		},
		removeCategory(req,res,next) {
			const id = req.params.idCategory;
			Category.findOneAndDelete({"_id":ObjectId(id)}) //findAndModify
	        .then(result => {
	            res.redirect('/admin/list-category');
	        })
	        .catch(err => console.log(err));

			},
		async editCategoryPage(req,res,next) {
			const user = await User.find({_id:req.user._id})
			let id = req.params.idCategory;
			Category.findById(id)
	        .then(reader => {
	            res.render('admin/edit-category', { data:reader,title: 'edit category page',page_name:'category',user});
	            console.log(reader)
	        }).catch(err => console.log(err));
		},
		postEditCategory(req,res,next) {
			const image = req.files.image.name;
			const title = req.body.name;
			const desc = req.body.desc;
			const id = req.body.id;
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

			Category.findById(id)
		        .then(cate => {
		            cate.name = title;
		            cate.deskripsi = desc;
		            cate.image = image;
		            return cate.save();
		        })
		        .then(result => {
		            res.redirect('/admin/list-category');
		        })
		        .catch((err) => {
		            // console.log(err)
		            req.flash('error', 'Something wrong happend.');
		            res.redirect('/admin/edit-category');
		        });

			// alternative update menu

			// Menus.updateOne({_id:req.body._id},{$set : {name: req.body.title,price: req.body.price, image: file.name}}).then( result => {
			// 	res.redirect('/admin/home')
			// }).catch(err => {
			// 	console.log(err)
			// })
		},
	}
}

module.exports = initCrud;