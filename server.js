const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const app = express();

//Database connection
const db = "mongodb+srv://sahil:zfsjoy%405mRqR@cluster0.v4uqg.mongodb.net/UpNote?retryWrites=true&w=majority";
mongoose.connect(db)
.then(
    () => console.log("Connected to MongoDB Atlas")
).catch(
    (e) => console.log(e)
);

const conn = mongoose.connection;

// Middleware
app.use(express.json());
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: false}));


//express session
app.use
(
    session
    (
        {
            secret: "ZLYQXpMP9KifnRvE4VvS",
            resave: true,
            saveUninitialized: true
        }
    )
);

//passport
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

//Routes
app.use("/", require("./routes/index"));
app.use("/forum", require("./routes/forum"));
app.use("/notes", require("./routes/notes"));


conn.once('open', () => {
    // Init stream
    const gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('notes');
});



const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'notes'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });


//Connection to port
const PORT = process.env.PORT || 6969;
app.listen
(
    PORT,
    (err) =>{
        if(err)
            throw err;
        console.log(`Server started on PORT ${PORT}...`);
    }
);