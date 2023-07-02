const app = require('express')();
const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
global.config = require('./../config');
const ejs = require("ejs")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const MongoStore = require("connect-mongo")(session)
const expressLayouts = require('express-ejs-layouts');
const Helpers = require('./helpers');



module.exports = class Application {
    constructor() {
        this.set();
    }

    async set() {

        // Connect to DB
        // mongoose.connect('mongodb://127.0.0.1:27017/nour' ,  { useFindAndModify: false } );
        mongoose.connect('mongodb://127.0.0.1:27017/kingcarpet', {
            useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
            // user:"",
            // pass:""
        });
      
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.Promise = global.Promise;

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json({ type: 'application/json' }));
        // app.use(expressValidator());

        app.set("view engine", "ejs")
        app.use(express.static("public"))
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json({ type: 'application/json' }));
        app.use(cookieParser("GWRr23$@E$#2q$R#245$2"))
        // app.use(session({
        //     secret: "GWRr23$@E$#2q$R#245$2",
        //     resave: false,
        //     saveUninitialized: true,
        //     cookie: { expires: new Date(Date.now() + 1000 * 60 * 60 * 60) },
        //     store: new MongoStore({ mongooseCmoonnection: mongoose.connection })
        // }))
        app.use(flash())
        app.use((req, res, next) => {
            app.locals = new Helpers(req, res).getObjects();
            next();
        });

        const webRouter = require('app/router/index');


        app.listen(config.port, () => {
            console.log(`Server running at Port ${config.port}`)
        }); app.use('/', webRouter);
    }
}
