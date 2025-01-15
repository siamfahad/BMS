const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/BMS');
const app = express();
const isBlog = require('./middlewares/isBlog');
app.use(isBlog.isBlog);
//for admin routes
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');
app.use('/', adminRoute);
app.use('/', userRoute);
app.use('/', blogRoute);
app.listen(3000, function() {
    console.log('server running');
})