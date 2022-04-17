const mongoose = require("mongoose");
const date = Date.now()


const notesSchema = new mongoose.Schema({
    name: {type: String},
    myFile: {type: mongoose.Schema.Types.Mixed}
});

module.exports = mongoose.model("notes",notesSchema);