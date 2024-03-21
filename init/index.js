const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");
const MONGO_LINK = 'mongodb://127.0.0.1:27017/wanderlust';
main().then((res) => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_LINK);
}
const initDB = async () =>{
    await Listings.deleteMany({});
     initData.data = initData.data.map((obj) => ({ ...obj,owner:"65e81bc0231c6c6436052164"}));

    await Listings.insertMany(initData.data);
    
    console.log("Initialised");

}
initDB();