var express = require('express');
var app = express();
var hb = require('express-handlebars').create();
var router = express.Router();
var per_page = 15;
var base_url = 'https://giayfutsal.com.vn';
/* GET home page. */
var newspages = require('../models/newspages');
var NewsContents = require('../models/newscontents');
var NewsCats = require('../models/newscats');
var Productlists = require('../models/productlists');
var ProductCat = require('../models/productcats');
var Seourls = require('../models/seourl');
var banners = require('../models/banners');
var listorders = require('../models/listorders');
var website = require('../models/websites');

router.get('/',async function(req, res, next) {
    var hostname = req.headers.host;
    var websiteinfo = await getwebsiteinfo(hostname);
    var customer_username = websiteinfo.customer_username
    ProductCat.getrootproductcats(websiteinfo.customer_id,async function(err, productcatroot){
      //trong ham nay goi await thi phai de async
        var hostname = req.headers.host;
        var productcat = await gethotproductcat(websiteinfo.customer_id);
        //var newproduct = await getnewproducts(websiteinfo.customer_id,10);
        res.render('content/'+customer_username+'/index', {
        productcats:productcat,
        //newproducts:newproduct,
        canonical:base_url+'/',
        title: websiteinfo.title,
        description: websiteinfo.description,  
        keyword: websiteinfo.keyword,
        layout: customer_username,
      });
  })
});
function gethotproductcat(customer_id) {
    return new Promise((resolve, reject)=>{
        ProductCat.gethotrootproductcats(customer_id,async function (err, productcat) {
            var productcatdetail = JSON.parse(JSON.stringify(productcat));
            if (productcat) {
              for (var x in productcat) {
                var temp = await getproductbycatcout(customer_id,productcat[x].cat_id);
                var productiteam = JSON.parse(JSON.stringify(temp));
                productcatdetail[x].product = productiteam;
              }
              resolve(productcatdetail);
            }
            else {
                reject('productcat null')
            }
        });
    });
}
function getproductbycatcout(customer_id,cat_id) {
    return new Promise((resolve, reject)=>{
        Productlists.getproductbycatcount(customer_id,cat_id,8,function(err, countproduct){

          if (countproduct) {
            var i = 1;
            for (var x in countproduct) {

              var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
              var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
              productiteam.pricebeauty = pricebeauty;
              productiteam.alt=countproduct[x].detail[0].name;
              if((i%2)!=0){
                productiteam.class="class_fist"
              }
              else{
                productiteam.class="class_end"
              }
              countproduct[x] = productiteam;

              i++;
            }
            resolve(countproduct);
          }
          else{
            reject('productcat null')
          }
        });
    });
}
function getnewproducts(customer_id,count) {
    return new Promise((resolve, reject)=>{
        Productlists.getnewproducts(customer_id,count,function(err, countproduct){
          if (countproduct) {
            for (var x in countproduct) {
              var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
              var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
              productiteam.pricebeauty = pricebeauty;
              productiteam.alt = countproduct[x].detail[0].name;
              countproduct[x] = productiteam;
            }
            resolve(countproduct);
          }
          else{
            reject('productcat null')
          }
        });
    });
}
function getnewnews(count) {
    return new Promise((resolve, reject)=>{
        NewsContents.getnewnews(count,function(err, countproduct){
          if (countproduct) {
            resolve(countproduct);
          }
          else{
            reject('productcat null')
          }
        });
    });
}
function rendercatsbyparent(customer_id,parent_id) {
    return new Promise((resolve, reject)=>{
        var listcat = '';
        ProductCat.getproductcatsbyparent(customer_id,Number(parent_id),async function (err, productcat) {
            //console.log(listcat);
            if (productcat) {
                listcat = listcat + '<ul>';
                for (var x in productcat) {
                  listcat = listcat + '<li><span><a href="/'+productcat[x].seo_url+'">'+productcat[x].detail[0].name+'</a></span>';
                    //listcat.push(productcat[x]);
                    //console.log(productcat[x])
                    if(productcat[x].list_child.length==0||productcat[x].list_child[0]==undefined){
                        //reject('productcat null')
                    }
                    else{ 
                      await rendercatsbyparent(customer_id,productcat[x].cat_id,listcat);
                    //return;
                    }
                    listcat = listcat + '</li>';
                }
                listcat = listcat + '</ul>';
                //console.log(listcat);
                resolve(listcat);
                //res.json(listcat);
            }
            else {
                reject('productcat null')
            }
        });
    });
}
router.post('/sentmail', function(req, res, next) {
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var taxcode = req.param('taxcode');
  var cont = 'Tên Khách hàng:'+name+'<br>-Email:'+email+'<br>-Điện thoại: '+phone+'<br>-MST: '+taxcode;
  let transporter = nodeMailer.createTransport({
          host: 'mail.smartvas.vn',
          port: 25,
          secure: false,
          auth: {
              user: 'mailtest@smartvas.vn',
              pass: '123456'
          }
  });
  let mailOptions = {
          from: '"Smartvas website" <mailtest@smartvas.vn>', // sender address
          to: "trinhpt@smartsign.com.vn", // list of receivers
          subject: "Khách hàng đăng ký", // Subject line
          text: cont, // plain text body
          html: cont, // html body
		  attachments: [{
            path: folderName + "/" + fileName
		}]
  };

  transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              
  });
  res.send('1');
});
router.post('/addtocart', function(req, res, next) {
  var listproducts = [];
  var total_price = 0;
  if(req.session.total_price){
    total_price = req.session.total_price;
  }
  else{

  }
  if(req.session.products){
    listproducts = req.session.products;
  }
  var product1 = req.param('productadd');
  var size = req.param('size');
  Productlists.getproductbyproductid(product1,function(err, product){
    var pricebeauty = String(product.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    var productincart ={
      product_id:product._id,
      image:product.image,
      name:product.detail[0].name,
      price:product.price,
      pricebeauty:pricebeauty,
      //size:size,
    }
    listproducts.push(productincart);
    req.session.products = listproducts;
    req.session.total_price = (Number(total_price) + Number(product.price));
    res.send(req.session.products);
    //console.log();
  });  
  
});
router.get('/getcart', function(req, res, next) {
  res.send(req.session.products);
});
router.get('/gio-hang',async function(req, res, next) {
  var key = req.param('key','1');
  var hostname = req.headers.host;
  var websiteinfo = await getwebsiteinfo(hostname);
  ProductCat.getrootproductcats(websiteinfo.customer_id,async function(err, productcatroot){
    var newproduct = await getnewproducts(10);
    var listproduct = req.session.products;
    res.render('content/shoppingcart', {
        newproducts:newproduct,
        listproducts:listproduct,
        title:'',
        layout: websiteinfo.customer_username,
    });
  });
});
function findproduct(key) {
  return new Promise((resolve, reject)=>{
      Productlists.findproductbykey(key,function(err, countproduct){
        if (countproduct) {
          for (var x in countproduct) {
            var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
            var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            productiteam.pricebeauty = pricebeauty;
            countproduct[x] = productiteam;
          }
          resolve(countproduct);
        }
        else{
          resolve(0);
        }
      });
  });
}
router.get('/thankorder', function(req, res, next) {
  var listcat = '';
  ProductCat.getrootproductcats(async function(err, productcatroot){
    var newproduct = await getnewproducts(10);
    for (var x in productcatroot) {
        listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
        var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
        listcat = listcat + listcat1;
        listcat = listcat + '</li>';  
    }
    res.render('content/thankorder', {
        listproductmenus:listcat,
        newproducts:newproduct,
        title:'',
        layout: 'public',
    });
  });
});
router.get('/tim-kiem', function(req, res, next) {
  var key = req.param('key','');
  console.log(key);
 
  ProductCat.getrootproductcats(async function(err, productcatroot){
    var newproduct = await getnewproducts(10);
    var listproduct = await findproduct(key);
    res.render('content/search', {
        newproducts:newproduct,
        contents:listproduct,
        title:'Tìm kiếm sản phẩm',
        layout: 'public',
    });
  });
});
router.get('/thong-tin-khach-hang', function(req, res, next) {
  var listcat = '';
  ProductCat.getrootproductcats(async function(err, productcatroot){
    var newproduct = await getnewproducts(10);
    for (var x in productcatroot) {
        listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a></span>';
        var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
        listcat = listcat + listcat1;
        listcat = listcat + '</li>';  
    }
    res.render('content/customerinfo', {
        listproductmenus:listcat,
        newproducts:newproduct,
        title:'',
        layout: 'public',
    });
  });
});
router.get('/lien-he', function(req, res, next) {
  res.render('content/contact', { title: 'Liên hệ - Cty CP hóa đơn điện tử Vi Na',layout: 'public' });
});
router.get('/bang-gia', function(req, res, next) {
  res.render('content/price', { title: 'Bảng giá - Cty CP hóa đơn điện tử Vi Na',layout: 'public' });
});
router.get('/:seourl',async function(req, res, next) {
  var seourl = req.params.seourl;
  var hostname = req.headers.host;
  var websiteinfo = await getwebsiteinfo(hostname);
  var customer_username = websiteinfo.customer_username
  Seourls.findByUrl(websiteinfo.customer_id,seourl,async function(err, producttypess){
    console.log(producttypess);
    if(producttypess){
      if(producttypess.type==1){
        newspages.getNewsPagesById(websiteinfo.customer_id,producttypess.content_id,function(err, conten){
          res.render('content/'+customer_username+'/page', {
            contents:conten,
            details:conten.detail[0],
            title:conten.detail[0].title,
            layout: customer_username
          });
        });
      }
      if(producttypess.type==2){
        var per_page = 18;
        var page = req.param('page','1');
        NewsCats.getnewscatsbycatid(websiteinfo.customer_id,producttypess.content_id,async function(err, newcatinfo){
            var count =await countnewsbycat(newcatinfo.cat_id);
            console.log(count);
            NewsContents.getnewsnontentsbycatcount(producttypess.content_id,page,per_page,function(err, conten){
                ProductCat.getrootproductcats(async function(err, productcatroot){
                  var newproduct = await getnewproducts(10);
                  var allpage = (count/per_page)+1;
                  var arraypage = [];
                  for (var i = 1; i <= allpage; i++ ) {
                      var temp ={
                        pagecount:i,
                        seo_url:newcatinfo.seo_url
                      }
                      arraypage.push(temp);
                  };
                  for (var x in conten) {
                    var newcatitem = JSON.parse(JSON.stringify(conten[x]));
                    var temp = conten[x].detail[0].description.substring(0,120);;
                    console.log(temp);
                    newcatitem.detail[0].shortdesc = temp;
                    conten[x] = newcatitem;
                  };
                  res.render('content/'+customer_username+'/newscat', {
                    newproducts:newproduct,
                    contents:conten,
                    allpage:arraypage,
                    newscatinfo:newcatinfo,
                    newcatdetail:newcatinfo.detail[0],
                    title:newcatinfo.detail[0].title,
                    description:newcatinfo.detail[0].description,
                    keyword:newcatinfo.detail[0].keyword,
                    canonical:base_url+'/'+newcatinfo.seo_url+'/',
                    orgimage:base_url+'/images/news/fullsize/'+conten.image,
                    layout: customer_username
                  });
                });
            });

        });
      }
      if(producttypess.type==3){
        var listcat = '';
        NewsContents.getNewsContentsById(producttypess.content_id,function(err, conten){
          var contentdetail = conten.detail[0].content.replace("http://giayfutsal.com.vn", "https://giayfutsal.com.vn");
          var procontent = JSON.parse(JSON.stringify(conten.detail[0]));
          procontent.content = contentdetail;
                ProductCat.getrootproductcats(async function(err, productcatroot){
                  //trong ham nay goi await thi phai de async
                  var newproduct = await getnewproducts(10);
                  for (var x in productcatroot) {
                        listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a></b><i class="fa fa-caret-right"></i></span>';
                        var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
                        listcat = listcat + listcat1;
                        listcat = listcat + '</li>';  
                  }
                  var allpage = (count/per_page)+1;
                  var arraypage = [];
                  for (var i = 1; i <= allpage; i++ ) {
                      var temp ={
                        pagecount:i,
                        seo_url:newcatinfo.seo_url
                      }
                      arraypage.push(temp);
                  };
                  res.render('content/'+customer_username+'/newscontent', {
                    listproductmenus:listcat,
                    newproducts:newproduct,
                    contents:conten,
                    details:procontent,
                    title:conten.detail[0].title,
                    description:conten.detail[0].description,
                    keyword:conten.detail[0].keyword,
                    canonical:base_url+'/'+conten.seo_url+'/',
                    orgimage:base_url+'/images/news/fullsize/'+conten.image2,
                    layout: customer_username
                  });
                });
        });
        
      }
      if(producttypess.type==4){
        var listcat = '';
        var per_page = 28;
        var page = req.param('page','1');
        var count = await countproductsbycat(producttypess.content_id);
        var catinfo = await getproductcatinfo(producttypess.content_id);
        Productlists.getallproductbycatshow(websiteinfo.customer_id,producttypess.content_id,Number(page),28,async function(err, conten){
            var newproduct = await getnewproducts(10);
            var i = 1;
            for (var x in conten) {
              var productiteam = JSON.parse(JSON.stringify(conten[x]));
              var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
              productiteam.pricebeauty = pricebeauty;
              productiteam.alt = conten[x].detail[0].name;
              if((i%2)!=0){
                productiteam.class="class_fist"
              }
              else{
                productiteam.class="class_end"
              }
              conten[x] = productiteam;
              i++;
            }
            var allpage = (count/per_page)+1;
            var arraypage = [];
            for (var i = 1; i <= allpage; i++ ) {
                var temp ={
                      pagecount:i,
                      seo_url:catinfo.seo_url
                }
                arraypage.push(temp);
            };
            res.render('content/'+customer_username+'/productscat', {
              newproducts:newproduct,
              contents:conten,
              allpage:arraypage,
              newscatinfo:conten,
              newproducts:newproduct,
              productcatinfo:catinfo.detail[0],
              title:catinfo.detail[0].title,
              canonical:base_url+'/'+catinfo.seo_url+'/',
              description:catinfo.detail[0].description,
              keyword:catinfo.detail[0].keyword,
              layout: customer_username
            });
          
        });
        
      }
      if(producttypess.type==5){
        var listcat = '';
        Productlists.getproductbyproductid(producttypess.content_id,async function(err, conten){
          var contentdetail = conten.detail[0].content.replace("http://giayfutsal.com.vn", "https://giayfutsal.com.vn");
          var procontent = JSON.parse(JSON.stringify(conten.detail[0]));
          procontent.content = contentdetail;
          var product_details = conten.product_detail;
            var newproduct = await getnewproducts(10);
            var pricebeauty = String(conten.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            if(conten.show==1){
              res.render('content/'+customer_username+'/productdetail', {
                description:conten.detail[0].description,
                canonical:base_url+'/'+conten.seo_url,
                orgimage:base_url+'/images/products/fullsize/'+conten.image2,
                newproducts:newproduct,
                contents:conten,
                newproducts:newproduct,
                product_details:product_details,
                price:pricebeauty,
                details:procontent,
                title:conten.detail[0].title,
                layout: customer_username
              });
            }
            else{
              res.render('content/'+customer_username+'/productdetail', {
                description:conten.detail[0].description,
                canonical:base_url+'/'+conten.seo_url+'/',
                orgimage:base_url+'/images/products/fullsize/'+conten.image2,
                newproducts:newproduct,
                contents:conten,
                newproducts:newproduct,
                product_details:product_details,
                price:pricebeauty,
                outofstock:1,
                details:procontent,
                title:conten.detail[0].title,
                layout: customer_username
              });
            }
        });
        
      }
      else{
        //res.render('content/newscat', { title: 'Login', layout: 'public' });
      }
    }
    else{
      res.render('content/newscat', { title: 'Login', layout: 'public' });
    }
  });
});
router.get('/:seourl/:selurl1.html', function(req, res, next) {
  var seourl1 = req.params.seourl;
  var seourl2 = req.params.selurl1;
  var seourl =  seourl1+'/'+seourl2+'.html';
  //console.log(seourl);
  Seourls.findByUrl(seourl,async function(err, producttypess){
    //console.log(producttypess);
    if(producttypess){
      if(producttypess.type==1){
        newspages.getNewsPagesById(producttypess.content_id,function(err, conten){
          res.render('content/page', {
            contents:conten,
            details:conten.detail[0],
            title:conten.detail[0].title,
            layout: customer_username
          });
        });
        
      }
      if(producttypess.type==2){
        var listcat = '';
        var per_page = 18;
        var page = req.param('page','1');
        NewsCats.getnewscatsbycatid(producttypess.content_id,async function(err, newcatinfo){
            var count =await countnewsbycat(newcatinfo.cat_id);
            console.log(count);
            NewsContents.getnewsnontentsbycatcount(producttypess.content_id,page,per_page,function(err, conten){
                ProductCat.getrootproductcats(async function(err, productcatroot){
                  //trong ham nay goi await thi phai de async
                  var newproduct = await getnewproducts(10);
                  for (var x in productcatroot) {
                        listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
                        var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
                        listcat = listcat + listcat1;
                        listcat = listcat + '</li>';  
                  }
                  var allpage = (count/per_page)+1;
                  var arraypage = [];
                  for (var i = 1; i <= allpage; i++ ) {
                      var temp ={
                        pagecount:i,
                        seo_url:newcatinfo.seo_url
                      }
                      arraypage.push(temp);
                  };
                  for (var x in conten) {
                    var newcatitem = JSON.parse(JSON.stringify(conten[x]));
                    var temp = conten[x].detail[0].description.substring(0,120);;
                    console.log(temp);
                    newcatitem.detail[0].shortdesc = temp;
                    conten[x] = newcatitem;
                  };
                  res.render('content/newscat', {
                    listproductmenus:listcat,
                    newproducts:newproduct,
                    contents:conten,
                    allpage:arraypage,
                    newscatinfo:newcatinfo,
                    newcatdetail:newcatinfo.detail[0],
                    title:newcatinfo.detail[0].title,
                    description:newcatinfo.detail[0].description,
                    keyword:newcatinfo.detail[0].keyword,
                    canonical:base_url+'/'+newcatinfo.seo_url,
                    orgimage:base_url+'/images/news/fullsize/'+conten.image,
                    layout: customer_username,
                  });
                });
            });

        });
      }
      if(producttypess.type==3){
        var listcat = '';
        NewsContents.getnewscontentbycontentid(producttypess.content_id,function(err, conten){
          var contentdetail = conten.detail[0].content.replace('http://giayfutsal.com.vn', 'https://giayfutsal.com.vn');
          var procontent = JSON.parse(JSON.stringify(conten.detail[0]));
          procontent.content = contentdetail;
                ProductCat.getrootproductcats(async function(err, productcatroot){
                  //trong ham nay goi await thi phai de async
                  var newproduct = await getnewproducts(10);
                  for (var x in productcatroot) {
                        listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
                        var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
                        listcat = listcat + listcat1;
                        listcat = listcat + '</li>';  
                  }
                  var allpage = (count/per_page)+1;
                  var arraypage = [];
                  for (var i = 1; i <= allpage; i++ ) {
                      var temp ={
                        pagecount:i,
                        seo_url:newcatinfo.seo_url
                      }
                      arraypage.push(temp);
                  };
                  res.render('content/newscontent', {
                    listproductmenus:listcat,
                    newproducts:newproduct,
                    contents:conten,
                    details:procontent,
                    title:conten.detail[0].title,
                    description:conten.detail[0].description,
                    keyword:conten.detail[0].keyword,
                    canonical:base_url+'/'+conten.seo_url,
                    orgimage:base_url+'/images/news/fullsize/'+conten.image2,
                    layout: customer_username,
                  });
                });
        });
      }
      if(producttypess.type==4){
        //console.log('1');
        var listcat = '';
        var per_page = 28;
        var page = req.param('page','1');
        var count = await countproductsbycat(producttypess.content_id);
        //var count = 0;
        console.log(count);
        var catinfo = await getproductcatinfo(producttypess.content_id);
        console.log(catinfo);
        Productlists.getallproductbycatshow(producttypess.content_id,Number(page),28,function(err, conten){
          ProductCat.getrootproductcats(async function(err, productcatroot){
            //trong ham nay goi await thi phai de async
            var newproduct = await getnewproducts(10);
            for (var x in productcatroot) {
                  listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
                  var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
                  listcat = listcat + listcat1;
                  listcat = listcat + '</li>';  
            }
            var i = 1;
            for (var x in conten) {
              var productiteam = JSON.parse(JSON.stringify(conten[x]));
              var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
              productiteam.pricebeauty = pricebeauty;
              productiteam.alt = conten[x].detail[0].name;
              if((i%2)!=0){
                productiteam.class="class_fist"
              }
              else{
                productiteam.class="class_end"
              }
              conten[x] = productiteam;
              i++;
            }
            var allpage = (count/per_page)+1;
            var arraypage = [];
            for (var i = 1; i <= allpage; i++ ) {
                var temp ={
                      pagecount:i,
                      seo_url:catinfo.seo_url
                }
                arraypage.push(temp);
            };
            res.render('content/productscat', {
              listproductmenus:listcat,
              newproducts:newproduct,
              contents:conten,
              allpage:arraypage,
              newscatinfo:conten,
              newproducts:newproduct,
              productcatinfo:catinfo.detail[0],
              title:catinfo.detail[0].title,
              canonical:base_url+'/'+catinfo.seo_url+'/',
              description:catinfo.detail[0].description,
              keyword:catinfo.detail[0].keyword,
              layout: customer_username
            });
          })
        });
      }
      if(producttypess.type==5){
        var listcat = '';
        Productlists.getproductbyproductid(producttypess.content_id,async function(err, conten){
          var contentdetail = conten.detail[0].content.replace("http://giayfutsal.com.vn", "https://giayfutsal.com.vn");
          var procontent = JSON.parse(JSON.stringify(conten.detail[0]));
          procontent.content = contentdetail;
          //console.log(conten);
          if(conten.product_detail){
            var product_details = conten.product_detail;
          }
          else{
            var product_details = [];
          }
          ProductCat.getrootproductcats(async function(err, productcatroot){
            //trong ham nay goi await thi phai de async
              var newproduct = await getnewproducts(10);
             for (var x in productcatroot) {
                  listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
                  var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id);
                  listcat = listcat + listcat1;
                  listcat = listcat + '</li>';  
             }
            var pricebeauty = String(conten.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            if(conten.show==1){
              res.render('content/productdetail', {
                description:conten.detail[0].description,
                canonical:base_url+'/'+conten.seo_url,
                orgimage:base_url+'/images/products/fullsize/'+conten.image2,
                listproductmenus:listcat,
                newproducts:newproduct,
                contents:conten,
                newproducts:newproduct,
                product_details:product_details,
                price:pricebeauty,
                details:procontent,
                title:conten.detail[0].title,
                layout: customer_username
              });
            }
            else{
              res.render('content/productdetail', {
                description:conten.detail[0].description,
                canonical:base_url+'/'+conten.seo_url,
                orgimage:base_url+'/images/products/fullsize/'+conten.image2,
                listproductmenus:listcat,
                newproducts:newproduct,
                contents:conten,
                newproducts:newproduct,
                product_details:product_details,
                price:pricebeauty,
                outofstock:1,
                details:procontent,
                title:conten.detail[0].title,
                layout: customer_username
              });
            }

          })

        });
        
      }
      else{
        //res.render('content/newscat', { title: 'Login', layout: 'public' });
      }
    }
    else{
      res.render('content/newscat', { title: 'Login', layout: 'public' });
    }
  });

});
function countnewsbycat(cat_id) {
    return new Promise((resolve, reject)=>{
        NewsContents.countnewscontentsbycat(cat_id,function(err, count){
          if (count) {
            resolve(count);
          }
          else{
            resolve(0);
          }
        });
    });
}
function countproductsbycat(cat_id) {
    return new Promise((resolve, reject)=>{
        Productlists.countproductlistsbycat(cat_id,function(err, count){
          console.log(count)
          if (count) {
            resolve(count);
          }
          else{
            resolve(0);
          }
        });
    });
}
function getproductcatinfo(cat_id) {
    return new Promise((resolve, reject)=>{
        ProductCat.getproductcatsbycatid(cat_id,function(err, count){
          if (count) {
            resolve(count);
          }
          else{
            reject('productcat null')
          }
        });
    });
}

router.post('/addorder', function(req, res, next) {
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var address = req.param('address');
  var create_date = new Date().getTime();
  var neworders = new listorders({
      name:name,
      email:email,
      phone:phone,
      address:address,
      create_date:create_date,
      total_money:req.session.total_price,
  });
  listorders.createlistorders(neworders, function(err, producttypess){
    for (var i in req.session.products) {
      var list_product = {
        product_id:req.session.products[i].product_id,
        product_name:req.session.products[i].name,
        product_price:req.session.products[i].price,
        product_image:req.session.products[i].image,
        product_size:req.session.products[i].size,
      }
      listorders.editlistorders(producttypess._id,{$push:{list_products:list_product}},function(err, companys) {
        if(err) throw err;
      })
    };
    req.session.destroy();
  });
  res.send('ok');
  var cont = 'Tên Khách hàng:'+name+'<br>-Email:'+email+'<br>-Điện thoại: '+phone+'<br>-MST: '+address;
  let transporter = nodeMailer.createTransport({
          host: 'mail.smartvas.vn',
          port: 25,
          secure: false,
          auth: {
              user: 'mailtest@smartvas.vn',
              pass: '123456'
          }
  });
  let mailOptions = {
          from: '"Smartvas website" <mailtest@smartvas.vn>', // sender address
          to: "congtruqn@gmail.com", // list of receivers
          subject: "Khách hàng đăng ký", // Subject line
          text: cont, // plain text body
          html: cont, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              
  });
  
});
function getwebsiteinfo(hostname) {
  return new Promise((resolve, reject) => {
    website.getwebsitesbyurl(hostname,function(err, websi){
      if (websi) {
          resolve(websi);
      } else {
          resolve(0);
      }
    });
  });
}
module.exports = router;
