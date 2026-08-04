const Listing=require("../models/listings.js");
const axios=require("axios");

module.exports.allListings=async (req,res)=>{
    let filter={};  
    let allListings;
    if(req.query.category){
        if(req.query.category==="Trending"){
            allListings=await Listing.find().sort({ views: -1 }).limit(20);
        }else{
            filter.category=req.query.category;
            allListings=await Listing.find(filter);
        }
    }else if(req.query.place){
        allListings=await Listing.find({$or:[{location:{$regex:req.query.place,$options:"i"}},{country:{$regex:req.query.place,$options:"i"}}]});
    }else{
        allListings=await Listing.find();
    }
    res.render("listings/index.ejs",{allListings});
};
module.exports.newRoute=async (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.addListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listData);
    newListing.owner=req.user._id;
    newListing.image={filename,url};

    const query = `${newListing.location}, ${newListing.country}`;

    const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
        params: {
            q: query,
            format: "json",
            limit: 1
        },
        headers: {
            "User-Agent": "wanderlust-app"
        }
    }
    );
    if(response.data.length===0){
        req.flash("error","Invalid Location");
        return res.redirect("/listings/new");
    }

    const latitude = parseFloat(response.data[0].lat);
    const longitude = parseFloat(response.data[0].lon);
    newListing.coordinates.push(latitude);
    newListing.coordinates.push(longitude);
    await newListing.save();
    req.flash("success","successfully added a new listing");
    res.redirect("/listings");
};
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let reqList=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    await Listing.findByIdAndUpdate(id,{$inc:{views: 1}})
    if(!reqList){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{reqList});
    }
};
module.exports.editForm=async (req,res)=>{
    let {id} =req.params;
    let reqList=await Listing.findById(id); 
    if(!reqList){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{ 
    let originalUrl=reqList.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{reqList,originalUrl});
    } 
};
module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body.listData,{new:true});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }
    const query = `${listing.location}, ${listing.country}`;
    
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: query,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "wanderlust-app"
            }
        }
    );
    if(response.data.length===0){
        req.flash("error","Invalid Location");
        return res.redirect("/listings/new");
    }
    
    const latitude = parseFloat(response.data[0].lat);
    const longitude = parseFloat(response.data[0].lon);
    listing.coordinates=[latitude,longitude];
    await listing.save();
    req.flash("success","Listing edited!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};