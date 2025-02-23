const express = require('express');
const router = express.Router();
const product = require('../models/productlists');
//const systems = require('../models/systems');
const caches = require('../models/cache');
const newsletters = require('../models/newsletters');
const productComment = require('../models/product_comments');
const priceMapping = require('../models/price_mappings');
const { createImage, validateImageType } = require('../models/systems');
const uploaddir = process.env.UPLOAD_DIR || 'E:/PROJECT/websites';
const { v4: uuidv4 } = require('uuid');
let fs = require('fs');
const fsx = require("fs-extra");
router.post('/addreview', async function (req, res, next) {
  const hostname = req.headers.host;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    const newElement = new productComment({
      name: req.body.nickname || '',
      content: req.body.content || '',
      rate: req.body.rate || 5,
      productlist: req.body.productId,
      customer_id: customer_id,
      isActive: false,
    });
    if (req.body.image) {
      const mimeType = req.body.image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0];
      let imageName = uuidv4() + '.' + 'webp';
      if (!validateImageType(mimeType)) throw new Error("Định dạng không được hỗ trợ");
      const newPath = uploaddir + '/' + websiteinfo.customer + '/images/medias/'
      if (!fs.existsSync(newPath)) {
          fsx.ensureDirSync(newPath)
      }
      let ratio = websiteinfo.image_height_ratio ? websiteinfo.image_height_ratio: 0.7;
      createImage(newPath + imageName, req.body.image, 360, ratio);
      newElement.image = imageName;
      newElement.image_path = '/' + websiteinfo.customer + '/images/medias/'+ imageName;
    }
    const result = await productComment.createReview(newElement);
    await product.addReview(customer_id,req.body.productId, result?._id);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_UPDATE_RATING'})
  }
});
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
  const email = req.query.email;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    if(!email) res.json({statusCode: 400, message:'EMAIL_IS_EXIST'})
    if(email){
      const result = await newsletters.getNewsLetter(customer_id ,email);
      if(result){
        res.json({statusCode: 400, message:'EMAIL_IS_EXIST'})
      }
      else{
        res.json({statusCode: 200,status: 'PASS'});
      }
    }
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_CREATE_NEWSLETTER'})
  }
});
router.get('/createxml', async function (req, res) {
  const hostname = req.headers.host;
  try {
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id, website_url } = websiteinfo;
    const listproducts = await product.getAllProducts(customer_id);
    var myDate = new Date();
    let date = ("0" + myDate.getDate()).slice(-2);
    let month = ("0" + (myDate.getMonth() + 1)).slice(-2);
    let year = myDate.getFullYear();
    var curent_date = year + "-" + month + "-" + date + "T12:00:00Z";
    var xml = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0"><title>' + websiteinfo.detail?.[0]?.title+'</title><link rel="self" href="https://'+website_url+'/"/><updated>'+curent_date+'</updated>';
    for (var x in listproducts) {
        xml = xml + '<entry>'
        xml = xml + '<g:id>'+listproducts[x].product_id+'</g:id>';
        var title =  listproducts[x].detail[0].title.replace(/&/g, "-");
        xml = xml + '<g:title>'+title+'</g:title>';
        var desc =  listproducts[x].detail[0].description.replace(/&/g, "-");
        xml = xml + '<g:description>'+desc+'</g:description>';
        xml = xml + '<g:link>https://'+website_url+'/'+listproducts[x].seo_url+'</g:link>';
        xml = xml + '<g:image_link>https://softnests.com/static'+listproducts[x].image_path+'fullsize/'+listproducts[x].image+'</g:image_link>';
        xml = xml + '<g:condition>new</g:condition>';
        xml = xml + '<g:availability>in stock</g:availability>';
        xml = xml + '<g:price>'+listproducts[x].price+' VND</g:price>';
        xml = xml + '<g:brand>OEM</g:brand>';
        xml = xml + '</entry>'
    }
    xml = xml + '</feed>';
    const newPath = uploaddir + '/' + websiteinfo.customer + '/product.xml'
    fs.writeFile(newPath, xml, function (err) {
    });
    res.json({statusCode: 200, message:'CREATED'})
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_CREATE_XML'})
  }
});4
router.post('/price-mapping', async function (req, res, next) {
  const productlist = req.body.productId;
  const value_ids = req.body.value_ids;
  try {
    const result = await priceMapping.getPriceMapping(productlist, value_ids);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_CREATE_NEWSLETTER'})
  }
});
module.exports = router;
