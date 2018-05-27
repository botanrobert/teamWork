const express = require("express");
const mongoose = require("mongoose");
const Idea = require("../models/Idea");
const router = express.Router();
const middlwareAuth = require("../helpers/auth");

//IDEAS ROUTES

//NEW ROUTE
router.get("/new", middlwareAuth.isLoggedIn, (req, res) => {
  res.render("ideas/new");
});

router.post("/", middlwareAuth.isLoggedIn, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    });
  }
  if (!req.body.details) {
    errors.push({
      text: "Please add details"
    });
  }
  if (errors.length > 0) {
    res.render("ideas/new", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };

    new Idea(newIdea).save().then(idea => {
      req.flash("success_msg", `Successfully added ${idea.title}`);
      res.redirect("/ideas");
    });
  }
});

//SHOW ROUTE
router.get("/", middlwareAuth.isLoggedIn, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({
      date: "desc"
    })
    .then(ideas => {      
        res.render("ideas/show", {
          ideas: ideas
        });      
    });
});

//EDIT ROUTE
router.get("/edit/:id", middlwareAuth.isLoggedIn, (req, res) => {
  Idea.findById(req.params.id).then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
    
  });
});

//EDIT ROUTE
router.put("/:id", middlwareAuth.isLoggedIn, (req, res) => {
  let updatedIdea = {
    title: req.body.title,
    details: req.body.details
  };

  Idea.findByIdAndUpdate(req.params.id, updatedIdea).then(() => {
    req.flash("success_msg", `Successfully updated ${updatedIdea.title}`);
    res.redirect("/ideas");
  });
});

//DELETE ROUTE
router.delete("/:id", middlwareAuth.isLoggedIn, (req, res) => {
  Idea.findByIdAndRemove(req.params.id).then(removeIdea => {
    req.flash("success_msg", `Idea - ${removeIdea.title} - deleted from DB`);
    res.redirect("/");
  });
});

module.exports = router;
