const User=require("../models/user.js");

module.exports.signUpForm=(req,res)=>{
     res.render("users/register.ejs");
};
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        let regUser=await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","Welcome to RoamNest");
                res.redirect("/listings");
            }
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
};
module.exports.loginForm=(req,res)=>{
   res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To RoamNest");
    let redirectURL=res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
};
module.exports.logout=(req,res,next)=>{
     req.logout((err)=>{
        if(err){
          next(err);
        }else{
            req.flash("success","You Are Logged Out!");
            res.redirect("/listings");
        }
     });
};
