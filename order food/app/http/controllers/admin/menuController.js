const Menu = require('../../../models/menu');
const User = require('../../../models/user');
const cartController = require('../customers/cartController');
// const crud = require('./admin/crudProduct')
function homeController() {
    return {
        async menuAdmin(req,res) {
          const user = await User.find({_id:req.user._id})
          Menu.find().then( (pizzas) => {
                // const menu = Menu.findById(req.params.menuId)
                res.render('admin/menu',{title: 'menu',pizzas,rupiah: cartController.rupiah,page_name:'menuall',user})
            });
        }
    }
}

module.exports = homeController