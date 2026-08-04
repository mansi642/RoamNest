const Listing=require("./models/listings.js");
const Review=require("./models/review.js");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};
module.exports.redirectURL=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
};
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        console.log(result.error);
        throw new expressError(result.error,400);
    }
    next();
};  
module.exports.validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        console.log(result.error);
        throw new expressError(result.error,400);
    }
    next();
};
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};