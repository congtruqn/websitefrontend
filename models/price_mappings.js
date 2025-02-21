const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const priceMappingSchema = mongoose.Schema({
    price: {
        type: Number,
    },
    sale_price: {
        type: Number,
    },
    value_ids: [{ type: String }],
    value_names: [{ type: String }],
    product_detail: [
        {
            detail_name: String,
            detail_id: String,
            value: String,
            value_id: String,
            detail_value: [
                {
                    value: String,
                    value_id: String,
                },
            ],
        },
    ],
    productlist: {
        type: String,
    },
})
const priceMapping = (module.exports = mongoose.model('price_mappings', priceMappingSchema))

module.exports.getPriceMapping = async function (product_id, value_ids) {
    if (!ObjectId.isValid(product_id)) return {}
    let query = { productlist: product_id, value_ids: value_ids }
    return await priceMapping.findOne(query).exec()
}