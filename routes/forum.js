const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport =require("passport");
const {checkAuthentication,checkLogin} = require("../config/authentication");
const user = require("../models/users");
const forum = require("../models/forum")

router.get(
    "/",
    (req,res) =>{
        forum.find({}).limit(20)
        .then(
            (forum) =>{
                if (forum){
                    res.render("forum", {user:req.user,posts:forum})  
                }
            }
        )

        
    }
)
router.get(
    "/newquestion",
    checkAuthentication,
    (req,res) =>{
        res.render("postquestion")
    }
)

router.post(
    "/newquestion",
    checkAuthentication,
    (req,res) =>{
        const author = req.user.full_name;
        const question = req.body.question;
        const newquestion = new forum(
            {   
                author:author,
                question:question
            }
        )
        newquestion.save().then(
            (user,req) => {
                res.redirect("/forum")
            }
        )
    }
)

router.get(
    "/myquestions",
    checkAuthentication,
    (req,res) =>{
        let user = req.user.full_name
        forum.find({author:user})
        .then(
            (forum) =>{
                if (forum){
                    res.render("forum", {user:req.user,posts:forum})  
                }
            }
        )
    }
)

router.post(
    "/answerpost",
    checkAuthentication,
    (req,res) =>{
        forum.find({question:req.body.question,author:req.body.author})
        .then(
            (forum)=>{
                if (forum){
                    res.render("answerpage",{question:req.body.question, author:req.body.author,posts:forum})
                }else{
                    res.render("answerpage",{question:req.body.question, author:req.body.author})
                }
            }
        )
    }
)

router.post(
    "/answerpost/answer",
    checkAuthentication,
    (req,res) =>{
        forum.findOneAndUpdate(
            {
                question:req.body.question
            },
            {
                $addToSet:{
                answers:
                    {
                        "answered_by": req.user.full_name,
                        "answer":req.body.youranswer
                    }
                }
            }
        ).then(
            (user,req) => {
                res.redirect("/forum")
            }
        )
    }
)
module.exports = router;