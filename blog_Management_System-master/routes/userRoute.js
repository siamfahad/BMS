const express = require('express');
const user_route = express();
const config = require('../config/config');
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));;

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

const session = require('express-session');
user_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

user_route.use(express.static('public'));
const userController = require('../controllers/userController');
const adminLoginAuth = require('../middlewares/adminLoginAuth');

user_route.get('/login', adminLoginAuth.isLogout, userController.loadLogin);
user_route.post('/login', userController.verifyLogin);
user_route.get('/profile', userController.loadProfile);
user_route.get('/logout', adminLoginAuth.isLogin, userController.logout);
module.exports = user_route;