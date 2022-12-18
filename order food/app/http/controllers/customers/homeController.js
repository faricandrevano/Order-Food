const Menu = require('../../../models/menu');
const User = require('../../../models/user');
const Category = require('../../../models/category');
var ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
moment.locale('id')
const cartController = require('./cartController');
// const crud = require('./admin/crudProduct')
function homeController() {
    return {
        async indexCustomers(req, res) {
            // const pizzas = await Menu.find();
            // return res.render('customers/home', { pizzas: pizzas, title : 'Home', rupiah: cartController.rupiah })
            // console.log(req.user.email)
            if(req.user) {
            const user = await User.find({_id:req.user._id})
            Menu.find().then( (pizzas) => {
                res.render('customers/home',{title: 'Home customers',page_name:'home',user})
            }) 
            } else {
              Menu.find().then( (pizzas) => {
                res.render('customers/home',{title: 'Home customers',page_name:'home'})
            })  
            }
        },
        async menuCustomers(req,res) {
            const dataMenu = await Menu.find({categori : req.params.categori});
            const dataCategory = await Category.find({name : req.params.categori});
            if(req.user) {
                const user = await User.find({_id:req.user._id})
                return res.render('customers/Menu', { dataMenu,dataCategory, title : 'Menu Order', rupiah: cartController.rupiah,page_name:'menu',user})
            } else {
                return res.render('customers/Menu', { dataMenu,dataCategory, title : 'Menu Order', rupiah: cartController.rupiah,page_name:'menu'})
            }
        },
        async detailMenu(req,res) {
            const dataMenu = await Menu.find({kodeMenu : req.params.idMenu});
            if(req.user) {
                const user = await User.find({_id:req.user._id})
                return res.render('customers/detailMenu',{dataMenu,title:'Menu Order',rupiah:cartController.rupiah,user})
            } else {
                return res.render('customers/detailMenu',{dataMenu,title:'Menu Order',rupiah:cartController.rupiah})
            }
        },
        async contactForm(req,res) {
            if(req.user){
                const user = await User.find({_id:req.user._id})
                return res.render('customers/contact',{title: 'contact',page_name:'contact',user})
            } else {
                return res.render('customers/contact',{title: 'contact',page_name:'contact'})
            }
        },
        async categori(req,res){
            const dataCategory = await Category.find()
            if(req.user) {
                const user = await User.find({_id:req.user._id})
                return res.render('categori',{title:'Menu',page_name:'menu',data:dataCategory,moment,user})
            } else {
                return res.render('categori',{title:'Menu',page_name:'menu',data:dataCategory,moment})
            }
        },
        async error(req,res) {
            if(req.user) {
            const user = await User.find({_id:req.user._id}) 
            res.render('errors/404',{user,title:'404 not found'})  
            } else {
                res.render('errors/404',{title:'404 not found'})  
            }
        }
    }
}

module.exports = homeController