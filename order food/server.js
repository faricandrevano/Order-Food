// import cookie,url di file .env

require('dotenv').config({
    path: './.env'
});
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const flash = require('express-flash');
const mongoDbStore = require('connect-mongo')(session);
const parser = require('body-parser');
const passport = require('passport');
const upload = require('express-fileupload');
const Emitter = require('events')


// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');
// app.use(expressLayouts);



// panggil untuk mendefinisikan conn dalam mongooose
const connection = mongoose.connection;
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    // option
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

connection.once('open', () => {
    console.log('Database Berhasil Terkoneksi');
}).on('error', (err) => {
    console.log('Database Gagal Terkoneksi');
});

let PORT;
if (process.env.PORT) {
    PORT = process.env.PORT;
} else {
    PORT = 5000;
}

// session store ke database
let mongoStore = new mongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


// session config
var hour = 3600000;
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        // expires: new Date(Date.now() + hour / 1000), 
        maxAge: 1000 * 60 * 60 * 8 //expired dalam 8 jam
    }
}));

// passport config
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
// berikan akses ke asset 
app.use(express.json());
app.use(express.static(path.join(__dirname,'./public/')));
app.use('/customers/menu',express.static('./public/img'));
app.use('/admin/menu',express.static('./public/img'));
app.use('/cart',express.static('./public/img'));
app.use('/admin',express.static('./public/img'));
app.use('/customers/categori/',express.static('./public/img'));
app.use('/customer/orders/',express.static('./public/img'));
app.use('/customers/categori/:categori/:idMenu',express.static('./public/img'));
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use(upload())


// aktifkan req.body yg dikirimkan melalalui form
app.use(parser.urlencoded({
    extended: false
}))
app.use(parser.json())

// Global middleware untuk menampilkan data session ke views
app.use((req, res, next) => {
    // const Users = require('./app/models/user.js')
    // const Userss = await Users.find();
    res.locals.sessions = req.session;
    res.locals.users = req.user;
        // console.log(req.user)
    next()
})

// masukan route
require('./routes/web')(app);

const server = app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`);
});

app.use((req, res) => {
    res.status(404).render('errors/404',{title: 'not found'})
})
// socket io

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})