const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
// const Noty = require('noty')

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/home' : '/customers/home'
    }
    return {
        login(req, res) {
            res.render('auth/login', {
                title: 'Login',
                page_name: 'login'
            })
        },
        postLogin(req, res, next) {
            const {
                email,
                password
            } = req.body
                // Validate request 
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register', {
                title: 'Register',
                page_name: 'register'
            })
        },
        async postRegister(req, res) {
            const {
                name,
                email,
                password,
                passwordConfirm,
                phone
            } = req.body
                // Validate request 
            if (!name || !email || !password || !phone) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // Check if email exists 

            const findUser = await User.findOne({
                email: email
            })
            if (findUser) {
                req.flash('error', 'Email sudah terdaftar')
                req.flash('nama', name)
                req.flash('pass', password)
                return res.redirect('/register')
            }
            if(password !== passwordConfirm) {
                req.flash('error', 'Password tidak sama')
                req.flash('nama',name)
                req.flash('email',email)
                return res.redirect('/register')
            }

            // User.exists({
            //     email: email,
            // }, (err, result) => {
            //     if (result) {
            //         req.flash('error', 'Email already taken')
            //         req.flash('name', name)
            //         req.flash('email', email)
            //         return res.redirect('/register')
            //     }

            // })



            // Hash password 
            const hashedPassword = await bcrypt.hash(password, 10)
                // Create a user 
            const user = new User({
                name,
                email,
                password: hashedPassword,
                passwordtype: password,
                phone
            })

            user.save().then((user) => {
                // Login
                return res.redirect('/customers/home');
                
            }).catch(err => {
                req.flash('error', 'ada yang salah, coba lagi!')
                return res.redirect('/register')
            })
        },
        // logout user
        logout(req, res) {
            req.logout(function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/customers/home');
            });
        }
    }
}

module.exports = authController