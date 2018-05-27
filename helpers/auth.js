const Idea = require("../models/Idea");
const middleware = {};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Not Authorized");
  res.redirect("/users/login");
};


module.exports = middleware;
