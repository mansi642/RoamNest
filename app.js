if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/expressError.js");
const listingsRoute=require("./routes/listings.js")
const reviewsRoute=require("./routes/reviews.js");
const userRoute=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const store=MongoStore.create({
    mongoUrl:process.env.MONGO_ATLAS_URL,
    touchAfter:24*60*60,
    crypto:{
        secret:process.env.SECRET
    }
});
store.on("error",function(e){
    console.log("session store error",e);
});
app.use(session({
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
    await mongoose.connect(process.env.MONGO_ATLAS_URL);
}
main()
.then(()=>console.log("database connected"))
.catch((err)=>console.log(err));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.search=req.query.place || "";
    next();
});
app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

app.all("/{*any}",(req,res)=>{
    throw new expressError("page not found",404);
});

app.use((err,req,res,next)=>{ 
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen("8080",()=>{
     console.log("server is listening on port 8080");
});