// let router = require('express').Router()

const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderControler = require('../app/http/controllers/customers/orderController');
const adminOrderControler = require('../app/http/controllers/admin/orderController');
const crudProduct = require('../app/http/controllers/admin/crudProduct');
const homeCustomer = require('../app/http/controllers/customers/homeController');
const homeAdmin = require('../app/http/controllers/admin/homeController');
const statusController = require('../app/http/controllers/admin/statusController');
const statusControllerCustomers = require('../app/http/controllers/customers/statusController');
const settingsController = require('../app/http/controllers/settingsController');

const menuController = require('../app/http/controllers/admin/menuController')
const categoryController = require('../app/http/controllers/admin/crudCategory');

// const bankTransfer = require('../app/http/controllers/payments/indexController');
// middleware 
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

function initRoutes(app) {
    app.get('/customers/home', homeCustomer().indexCustomers);
    app.get('/cart', cartController.cartController().index);
    app.post('/update-cart', cartController.cartController().update);
    app.post('/remove-item', cartController.cartController().removeItem);
    // app.post('/cart/decrease-item', cartController.cartController().decreaseItem);
    // app.get('/customer/cart:/id', cartController.cartController().removeItem);

    // auth route
    app.get('/register', guest, authController().register);
    app.post('/logout', authController().logout);
    app.post('/register', authController().postRegister);
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin);

    // custommers route
    app.post('/orders', orderControler().store);
    app.get('/customer/orders/', auth, orderControler().index);
    app.get('/contact', homeCustomer().contactForm);
    app.get('/customer/orders/:id', auth, orderControler().show);
    app.get('/customers/categori/:categori',homeCustomer().menuCustomers);
    app.get('/customers/categori/:categori/:idMenu',homeCustomer().detailMenu);
    app.get('/customers/categori',homeCustomer().categori);
    app.get('/cart/:qty/:dataPrice/:idMenu',cartController.cartController().edit);
    app.post('/customers/orders/status',auth,statusControllerCustomers().update);
    // app.get('/customer/orders',auth,orderControler().pagination);
    
    // admin route
    app.get('/admin/orders', admin, adminOrderControler().index);
    app.get('/admin/home', admin, homeAdmin().indexAdmin);
    app.get('/admin/menu-view', admin, menuController().menuAdmin);
    app.post('/admin/order/status', admin, statusController().update);

    // admin menu route
    app.get('/admin/remove-product/:kodeMenu', admin, crudProduct().removeProduct);
    app.post('/admin/edit-product', admin, crudProduct().postEditProduct);
    app.get('/admin/edit-product/:menuId', admin, crudProduct().editProductPage);
    app.post('/admin/add-product', admin, crudProduct().postProduct);
    app.get('/admin/add-product', admin, crudProduct().getProductForm);
    app.get('/admin/list-menu',admin,crudProduct().index)
    // admin category route
    app.get('/admin/list-category',admin,categoryController().index)
    app.get('/admin/remove-category/:idCategory',admin,categoryController().removeCategory)
    app.get('/admin/edit-category/:idCategory', admin, categoryController().editCategoryPage);
    app.post('/admin/edit-category', admin, categoryController().postEditCategory);
    app.post('/admin/add-category',admin,categoryController().postCategory)
    app.get('/admin/add-category',admin,categoryController().getForm)
    // report route
    app.get('/admin/downloadReport', admin, adminOrderControler().generatePdf);
    
    // settings profile route
    app.get('/settings',auth,settingsController().index);
    app.get('/settings/admin',admin,settingsController().index);
    app.post('/settings/profilePost',auth,settingsController().profileUpdate);
    app.all('*',homeCustomer().error);
    // app.route('/customer/orders')
    //     .get(auth,orderControler().index)
    //     .post(auth,orderControler().pagination)
}
module.exports = initRoutes;