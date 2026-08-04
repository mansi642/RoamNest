const mongoose=require("mongoose");
const Review=require("./review.js");
let listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        filename:String,
        url:String
    },
    description:String,
    price:Number,
    location:String,
    country:String,
    reviews:[
        {type:mongoose.Schema.Types.ObjectId,ref:"Review"}
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    coordinates:{
        type:[Number],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;