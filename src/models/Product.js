const mongoose = require('mongoose');
const moment = require("moment");

const productSchema = mongoose.Schema({
    _id: String,
    name: {
        type:String,
        maxlength:50,
        required:true
    },
    description: {
        type:String,
        trim:true
    },
    price: {
        type: Number,
        maxlength: 6
    },
    discounted_price: {
        type:Number,
        maxlength: 6
    },
    filename: String,
    category_id: String,
    seller_id: String,
    location: String,
    reviews: [{ writer: String, body: String, date:{ type: Date, default: Date.now }, rating: Number }],
    datePosted: { type: Date, default: Date.now },
})


/*productSchema.pre('save', function( next ) {
    var user = this;
    
    if(user.isModified('password')){    
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});*/

productSchema.methods.findAll = function (limit,cb){
    this.model('products').
    find().
    //where('price').gt(parseFloat(options.from)).lt(parseFloat(options.to)).
    //where('location').equals(options.location).
    //sort('review.rating')
    limit(parseFloat(limit)).
    sort('-datePosted').
    select("name price _id description discounted_price filename datePosted location reviews").
    exec((err, docs)=>{
        if(err) return cb(err)
        return cb(null,docs)
    });
  
}


var Product = mongoose.model('products', productSchema);

module.exports = Product