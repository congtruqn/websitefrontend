const express = require('express');
const router = express.Router();
const product = require('../models/productlists');
//const systems = require('../models/systems');
const caches = require('../models/cache');
const newsletters = require('../models/newsletters');
router.post('/rating',async function(req, res, next) {
  const hostname = req.headers.host;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    const productInfo = await product.getProductById(customer_id, req?.body?.productId);
    const vote = Number(req?.body?.vote || 5);
    const ratings = Number(productInfo?.ratings || 0 ) + vote;
    const votes = Number(productInfo?.votes || 0 ) + 1;
    let rating = Math.round((ratings / votes), 0);
    const result = await product.updateRating(customer_id,req?.body?.productId,rating,ratings,votes);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_UPDATE_RATING'})
  }
});
router.post('/subscribe',async function(req, res, next) {
  const hostname = req.headers.host;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    const newItems = new newsletters({
      email: req.body?.email,
      name: req.body?.name,
      customer_id: customer_id
    });
    const result = await newsletters.createNewsLetter(newItems);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_CREATE_NEWSLETTER'})
  }
});
router.get('/validate-email',async function(req, res, next) {
  const hostname = req.headers.host;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    res.json({status: 'PASS'});
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_CREATE_NEWSLETTER'})
  }
});
module.exports = router;
