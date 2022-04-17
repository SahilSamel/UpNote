const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
    author:{type:String,reuired:true},
    question:{type:String,required:true},
    answers:[{
        answered_by:{type:String},
        answer:{type:String},
        date:{type:Date}
    }
    ]
});

module.exports = mongoose.model("forum",forumSchema);