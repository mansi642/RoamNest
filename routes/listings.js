const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingsController=require("../controllers/listings.js");
const multer = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


router.route("")
  .get(wrapAsync(listingsController.allListings))
  .post(isLoggedIn,upload.single("listData[image]"),validateListing,wrapAsync(listingsController.addListing));

router.get("/new",isLoggedIn,wrapAsync(listingsController.newRoute));

router.route("/:id")
   .get(wrapAsync(listingsController.showListing))
   .patch(isOwner,upload.single("listData[image]"),validateListing,wrapAsync(listingsController.editListing))
   .delete(isLoggedIn,isOwner, wrapAsync(listingsController.destroyListing ));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.editForm));



module.exports=router;