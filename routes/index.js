const bcrypt = require('bcryptjs');
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const router = express.Router();
const passport =require("passport");
const {checkAuthentication,checkLogin} = require("../config/authentication");
const User = require("../models/users");

// let prevurl;


// window.addEventListener(
//     "load",
//     () =>
//     {
//         var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//         localStorage.setitem("prevurl",fullUrl)
//         if(localstorage.getitem("prevurl").endsWith("/login")){   
//         }
//         else{
//             prevurl = localStorage.getitem("prevurl");
//         }
//     }
// );

router.get(
    "/",
    (req,res) =>{
        res.render("homepage", {user:req.user})
    }
)

router.get(
    "/login",
    checkLogin,
    (req,res)=>{
        res.render("login")
        
    }
)

router.post(
    "/login",
    checkLogin,
    (req,res,next) =>{
        passport.authenticate
        (
            'local',
            {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }
        )(req, res, next);
        req.session.loggedin = true
    }
    
)

router.get(
    "/signup",
    checkLogin,
    (req,res) =>{
        res.render("signup");
    }
)

router.post(
    "/signup",
    checkLogin,
    (req,res,next) => {
        const {username,password,email,full_name,type,sem,branch,college_name} = req.body;
        
        let errors = []

        if (!username)
            errors.push("Please enter an username")
        if (!password)
            errors.push("Please enter a password")
        if (!email)
            errors.push("Please enter an email")
        
        if (errors.length>0)
            res.render(
                "signup",{
                    username,
                    email,
                    password,
                    full_name
                }
            );

        else{
            User.findOne(
                {
                    username:username,
                    email:email
                }
            ).then(
                (user) => {
                    if (user){
                        errors.push("That email has been used")
                        res.render(
                            "register",
                            {
                                username,
                                email,
                                password,
                                full_name,
                                type,
                                sem,
                                branch,
                                college_name
                            }
                        );
                    }
                    else{
                        const newUser = new User
                        (
                            {
                                username,
                                email,
                                password,
                                full_name,
                                type,
                                sem,
                                branch,
                                college_name
                            }
                        )
                    
                        bcrypt.hash(
                            newUser.password,
                            10,
                            (err,hash) => {
                                if(err)
                                    throw err;
    
                                newUser.password = hash;
                                newUser.save().then(
                                    (user,req) => {
                                        res.redirect("/login")
                                    }
                                )
                            }
                            );
                    }

                    
                }
            )
        }
    }
)

router.get(
    '/logout',
    checkAuthentication,
    (req, res) =>
    {
        req.logOut();
        res.redirect("/");
    }
)

router.get(
    '/logout',
    checkAuthentication,
    (req, res) =>
    {
        req.logOut();
        res.redirect("/");
    }
)
module.exports = router;