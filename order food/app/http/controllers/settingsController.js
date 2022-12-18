const User = require('../../models/user');
const bcrypt = require('bcrypt');
function settingsController() {
	return {
		async index(req,res,next) {
			const user = await User.find({_id:req.user._id});
			res.render('settings',{title:'Settings',user});
		},
		async profileUpdate(req,res,next) {
			// const user = await User.find({_id:req.user._id});
			const newUsername = req.body.username;
			const newPhone = req.body.phone;
			const newemail = req.body.email;

			const {
                username,
                email,
                phone
            } = req.body
                // Validate request 
            if (!username || !email || !phone) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/settings')
            }
			const findUser = await User.findOne({
                email: newemail
            })
            if (findUser) {
                req.flash('error', 'Email sudah terdaftar')
                req.flash('nama', username)
                return res.redirect('/settings')
            }
			User.updateOne({
				_id: req.user._id
			},{
				$set: {
					name: newUsername,
					email: newemail,
					phone: newPhone
				}
			}).then(()=>{
				res.redirect('/settings');
			})
		}
	}
}

module.exports = settingsController;