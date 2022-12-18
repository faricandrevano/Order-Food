const Menu = require('../../../models/menu');
const cartController = require('../customers/cartController');
const User = require('../../../models/user');

function homeController() {
    return {
        async indexAdmin(req, res) {
            const user = await User.find({_id:req.user._id});
            res.render('admin/home',{title: 'Home admin',page_name:'home',user})
        }
    }
}

module.exports = homeController;