const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type: String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    full_name:{type:String,required:true},
    type:{type:String, enum:["student","teacher"]},
    sem:{type:Number,required:true},
    branch:{type:String,required:true},
    college_name:{type:String,required:true}
});

module.exports = mongoose.model("users",userSchema);