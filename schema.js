const joi= require("joi");

const listingSchema=joi.object({
    listData:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        description:joi.string().required(),    
        image:joi.object({
            url:joi.string().allow("",null)
        }),
        location:joi.string().required(),
        country:joi.string().required(),
        category:joi.string().valid("Mountains","Iconic Cities","Castles","Amazing Pools","Beach","Arctic","Farms").required(),
       }).required(),
      
});
const reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
});

module.exports={listingSchema,reviewSchema};

