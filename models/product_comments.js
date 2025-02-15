const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const productCommentSchema = mongoose.Schema({
    image: {
        type: String,
    },
    image_path: {
        type: String,
    },
    name: {
        type: String,
    },
    content: {
        type: String,
    },
    rate:{
		type: Number,
	},
    productlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productlists',
    },
})
const productComment = (module.exports = mongoose.model('product_comments', productCommentSchema))
module.exports.createReview = async function (newimages) {
    return await newimages.save()
}