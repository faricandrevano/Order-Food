// middleware ini berfungsi sebagai batu loncatan jika browser masih bisa akses page login dan register walau sudah login 
function guest (req,res,next) {
	if(req.isAuthenticated()) {
		return res.redirect('/')
	}
	return next()
}
module.exports = guest;