const express = require("express");
const path = require("path");
const port = process.env.PORT || 5000;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");



//REQUIRE DOTENV FOR ENVIRONMENT VARIABLES
require('dotenv').config();

//LOAD ROUTES
const IdeasRoute = require("./routes/ideas");
const Users = require("./routes/users");

//PASSPORT CONFIG
require("./config/passport")(passport);

//INITIALIZED EXPRESS
const app = express();

//CONNECT DB
mongoose
  .connect(process.env.DATABASEURL)
  .then(() => console.log("MongoDB Connected...."))
  .catch(err => console.log(err));

// HANDLEBARS MIDDLEWARE
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

//BODY PARSER MIDDLEWARE
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//METHOD OVERRIDE MIDDLEWARE
app.use(methodOverride("_method"));

//EXPRESS SESSION MIDDLEWARE
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH MIDDLEWARE
app.use(flash());

//GLOBAL VARIABLES
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  next();
});

//USE ROUTES
app.use("/ideas", IdeasRoute);
app.use("/users", Users);

// ===================
// ROUTES
// ===================

//INDEX ROUTE
app.get("/", (req, res) => {
  res.render("index");
});

//ABOUT ROUTE
app.get("/about", (req, res) => {
  res.render("about");
});

// APP LISTEN METHOD ON PORT
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
