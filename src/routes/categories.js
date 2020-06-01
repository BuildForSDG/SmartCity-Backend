var express = require('express')
const Category = require('../models/Categories')
var router = express.Router()

router.post('/',function(req,res){
    var category = new Category(req.body)
    category.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json(doc)
    });
})
router.get('/', function(req,res){
    Category.find(function(err, docs){
            if(err) return res.status(400).send(err)
            res.status(200).json(docs)
    })
})
module.exports = router