const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport =require("passport");
const {checkAuthentication,checkLogin} = require("../config/authentication");
const user = require("../models/users");
const forum = require("../models/forum")
const notes = require("../models/notes")
const crypto = require('crypto');
const multer = require('multer');
const upload = multer()
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
router.use(fileUpload());


router.get(
    "/",
    (req,res) =>{
        res.render("notes", {user:req.user})
    }
)

router.get(
    "/newnote",
    checkAuthentication,
    (req,res) =>{
        res.render("newnote")
    }
)

router.post(
    "/newnote",
    checkAuthentication,
    async(req,res)=>{
        const uploadedby = req.user.full_name;
        const note = new notes({
            name:uploadedby,
            myFile : req.files.note
        });
        await note.save(); 
        res.redirect("/notes")   
    }
)

module.exports = router;