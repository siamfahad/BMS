const express = require('express');
const admin_route = express();
const adminController = require('../controllers/adminController');
const adminLoginAuth = require('../middlewares/adminLoginAuth');
const bodyParser = require('body-parser');
const config = require('../config/config');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));;
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');

//image storage
const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function(req, file, cb) {
        const name = `${Date.now()}-${file.originalname}`
        cb(null, name);
    }
})
const session = require('express-session');
admin_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))
const upload = multer({ storage: storage });
// admin_route.get('/login');
admin_route.get('/blog-setup', adminController.blogSetup);
admin_route.post('/blog-setup', upload.single('blog_image'), adminController.blogSetupSave);
admin_route.get('/dashboard', adminLoginAuth.isLogin, adminController.dashboard);
admin_route.get('/create-post', adminLoginAuth.isLogin, adminController.loadPostDashboard);
admin_route.post('/create-post', adminLoginAuth.isLogin, adminController.addPost);
admin_route.post('/upload-post-image', upload.single('image'), adminLoginAuth.isLogin, adminController.uploadPostImage);
//to prevent cache control i.e destroy session after back in browser
admin_route.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

module.exports = admin_route;