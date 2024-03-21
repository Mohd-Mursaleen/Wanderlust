require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const Listings = require("./models/listing.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
var flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
var methodOverride = require("method-override");
const dbUrl = process.env.ATLASDB_URL;
const app = express();
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Users = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// const {reviewSchema} = require("./schema.js");
const { listingSchema, reviewSchema } = require("./schema.js");
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
let sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    htmlOnly: true,
  },
};
store.on("error", () => {
  console.log("Error in Mongo Store", err);
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// app.get("/newUser" , async (req,res) => {
//     let fakeUser = new Users({
//         email:"abc@gmail.com",
//         username:"md"
//     });
//     let newUser = await Users.register(fakeUser , "hello");
//     res.send(newUser);
// })

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use("/listings", listings);
app.use("/listings/:id/review", reviews);
app.use("/", users);
app.get("/", async (req, res) => {
  let allListings = await Listings.find({});
  res.render("listings/home.ejs", { allListings });
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not founds"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  return res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(8080, (req, res) => {
  console.log("I am  root");
});
