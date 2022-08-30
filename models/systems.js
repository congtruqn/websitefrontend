var mongoose = require("mongoose")
var ProductCat = require('../models/productcats');
var NewsContents = require('../models/newscontents');
var NewsCats = require('../models/newscats');
var Productlists = require('../models/productlists');
var ProductCat = require('../models/productcats');
var Seourls = require('../models/seourl');
var banners = require('../models/banners');
var website = require('../models/websites');
var menu = require('../models/menu');
var footer = require('../models/footer');
var caches = require('../models/cache');
var productlists  = require('../models/productlists');
var productmoreinfo  = require('../models/productmoreinfo');
var caches = require('../models/cache');
var testimonials = require('../models/testimonials');
module.exports.gethotproductcat = function(customer_id){
  return new Promise((resolve, reject)=>{
    var listcat = '';
    ProductCat.getrootproductcats(customer_id,async function(err, productcatroot){
      for (var x in productcatroot) {
          listcat = listcat + '<li class="product_menu_item"><span><a href="/'+productcatroot[x].seo_url+'">'+productcatroot[x].detail[0].name+'</a><i class="fa fa-caret-right"></i></span>';
          var listcat1 = await rendercatsbyparent(customer_id,productcatroot[x].cat_id,'');
          listcat = listcat + listcat1;
          listcat = listcat + '</li>';  
      }
      resolve(listcat);
    });
  });
}
//Lấy danh sách danh mục sản phẩm hot theo customer
module.exports.gethotproductcategory = function(customer_id){
  return new Promise((resolve, reject)=>{
    var listcat = '';
    ProductCat.gethotproductcategory(customer_id,async function(err, productcategory){
      if(productcategory){
        resolve(productcategory);
      }
      else{
        resolve({});
      }
    });
  });
}
module.exports.getproductmenu = function(customer_id){
  return new Promise((resolve, reject)=>{
    var listcat = '';
    website.getwebsitesbycustomerid(customer_id,function(err, websiteinfo){
      ProductCat.getrootproductcats(customer_id,async function(err, productcatroot){
        for (var x in productcatroot) {
          let icon = '';
          let icon_font  = productcatroot[x].icon_font?productcatroot[x].icon_font:null;
          let icon_image = productcatroot[x].icon?productcatroot[x].icon:null;
          if(icon_font){
            icon = `<i class="${icon_font}"></i>`
          }
          else if(icon_image){
            icon = '<img src="'+productcatroot[x].icon+'" alt="menu icon">'
          }
          listcat = listcat + '<li class="product_menu_item"><a href="/'+productcatroot[x].seo_url+'">'
            +'<i class="menu-icon img-icon">'
            + icon
            +'</i><span>'+productcatroot[x].detail[0].name+'</span></a>';
            var listcat1 = await rendercatsbyparent(customer_id,productcatroot[x].cat_id,'');
            listcat = listcat + listcat1;
            listcat = listcat + '</li>';  
        }
        resolve(listcat);
      });
    })
  });
}
function rendercatsbyparent(customer_id,parent_id,listcat) {
    return new Promise((resolve, reject)=>{
        ProductCat.getproductcatsbyparent(customer_id,Number(parent_id),async function (err, productcat) {
            if (productcat.length>0) {
                listcat = listcat + '<ul>';
                for (var x in productcat) {
                  listcat = listcat + '<li><a href="/'+productcat[x].seo_url+'">'+productcat[x].detail[0].name+'</a>';
                  if(productcat[x].list_child.length==0||productcat[x].list_child[0]==undefined){
                  }
                  else{ 
                    var aaa = await rendercatsbyparent(customer_id,productcat[x].cat_id,listcat);
            
                    listcat = aaa;
                  }
                  listcat = listcat + '</li>';
                }
                listcat = listcat + '</ul>';
                resolve(listcat);
            }
            else {
              resolve('');
            }
        });
    });
}
module.exports.rendermainmenu = async function(customer_id){
  return new Promise((resolve, reject)=>{
    menu.getrootmenu(customer_id,async function(err, menuroot){
      var listcat = '<ul class="ul_mainmenu">';
      for (var x in menuroot) {
        listcat = listcat + '<li class="mainmenu_item"><span><a href="/'+menuroot[x].link+'">'+menuroot[x].detail[0].name+'</a></span>';
        var listcat1 = await renderrootmenuparent(customer_id,menuroot[x].cat_id,'');
        listcat = listcat + listcat1;
        listcat = listcat + '</li>';  
      }
      listcat = listcat + '</ul>';
      resolve(listcat);
    });
  });
}
function renderrootmenuparent(customer_id,parent_id,listcat) {
  return new Promise((resolve, reject)=>{
      menu.getmenubyparent(customer_id,Number(parent_id),async function (err, productcat) {
          if (productcat.length>0) {
              listcat = listcat + '<ul>';
              for (var x in productcat) {
                listcat = listcat + '<li><span><a href="/'+productcat[x].link+'">'+productcat[x].detail[0].name+'</a></span>';
                  if(productcat[x].list_child.length==0||productcat[x].list_child[0]==undefined){
                  }
                  else{ 
                    await renderrootmenuparent(customer_id,productcat[x].cat_id,listcat);
                  }
                  listcat = listcat + '</li>';
              }
              listcat = listcat + '</ul>';
              resolve(listcat);
          }
          else {
            resolve('');
          }
      });
  });
}
module.exports.getwebsiteinfo = function(hostname, callback){
	var query = {website_url:hostname};
	website.findOne(query, callback);
}
module.exports.getfooterbycustomer = function(customer_id){
  return new Promise((resolve, reject)=>{
    footer.getfooterbycustomer(customer_id,function(err, footerinfo){
      if(footerinfo){
        resolve(footerinfo)
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.getwebsitebyseourl = function(customer_id,seo_url){
  return new Promise((resolve, reject)=>{
    Seourls.findByUrl(customer_id,seo_url,async function(err, website){
      if(website){
        resolve(website)
      }
      else{
        resolve(null);
      }
    });
  })
}
module.exports.gettestimonialsbycustomer = function(customer_id){
  return new Promise((resolve, reject)=>{
    testimonials.getcounttestimonialsbycustomer(3,customer_id,async function(error,testimo){
      if(testimo){
        resolve(testimo)
      }
      else{
        resolve([]);
      }
    })
  })
}
module.exports.gettemplates = function(){
  return new Promise((resolve, reject)=>{
    website.gettemplatewebsites(8,async function(error,templatewebsite){
      if(templatewebsite){
        resolve(templatewebsite)
      }
      else{
        resolve([]);
      }
    })
  })
}
module.exports.getbanner = function(customer_id) {
  return new Promise((resolve, reject)=>{
    banners.getbannerbycustomer(customer_id,async function(err, banners){
        if (banners) {
          resolve(banners);
        }
        else{
          resolve([]);
        }
    });
  });
}
module.exports.gethotproductbycustomer = function(customer_id,count,products_name_letters){
  return new Promise((resolve, reject)=>{
    productlists.gethotproducts(customer_id,count,function(err, countproduct){
      if(countproduct){
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = productiteam.price?String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'):'';
          var sale_pricebeauty = productiteam.sale_price?String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'):'';
          var productname = countproduct[x].detail[0].name;
          if(productname.length>products_name_letters){
            productname = countproduct[x].detail[0].name.substring(0,products_name_letters)+"...";
          }
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;
          var salepec = parseInt(((productiteam.sale_price-productiteam.price)/productiteam.sale_price)*100);
          productiteam.alt=countproduct[x].detail[0].name;
          productiteam.productname = productname;
          if(productiteam.sale==1){
            productiteam.salepec = salepec;
          }
          if(productiteam.hot==0){
            productiteam.hot = undefined;
          }
          if(productiteam.new==0){
            productiteam.new = undefined;
          }
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.getnewproductbycustomer = function(customer_id,count,products_name_letters){
  return new Promise((resolve, reject)=>{
    productlists.getnewproducts(customer_id,count,function(err, countproduct){
      if(countproduct){
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          if(productname.length>products_name_letters){
            productname = countproduct[x].detail[0].name.substring(0,products_name_letters)+"...";
          }
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;
          var salepec = parseInt(((productiteam.sale_price-productiteam.price)/productiteam.sale_price)*100);
          productiteam.alt=countproduct[x].detail[0].name;
          productiteam.productname = productname;
          if(productiteam.sale==1){
            productiteam.salepec = salepec;
          }
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.getallchoiseproductmoreinfos = function(customer_id){
  return new Promise((resolve, reject)=>{
    productmoreinfo.getallchoiseproductmoreinfo(customer_id,function(err, countproduct){
      if(countproduct){
        resolve(countproduct);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.getproductbyproductmoreinfos = function(customer_id,num){
  return new Promise((resolve, reject)=>{
    productmoreinfo.getallchoiseproductmoreinfo(customer_id,function(err, countproduct){
      if(countproduct.length>0){
        var product_more_infos = JSON.parse(JSON.stringify(countproduct[0].default_value));
        for (const x in product_more_infos) {
            product_more_infos[x].list_products = {};
            let id = product_more_infos[x].default_id;
            productlists.getproductsbymoreinfo(customer_id,num,id,function(err, products){
              let temp = JSON.parse(JSON.stringify(products))
              product_more_infos[x].list_products = temp
            })
        }
        resolve(product_more_infos);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.gettopnewscatsandcontent = function(customer_id,count,callback){
  NewsCats.gethotnewcatbyrank(customer_id,count,function(err, countproduct){
    if (countproduct) {
      for (var x in countproduct) {
        var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = countproduct[x].detail[0].name;
        countproduct[x] = productiteam;
      }
      return callback(null,countproduct);
      //resolve(countproduct);
    }
    else{
      return callback(null,[]);
    }
  });
}
module.exports.gethotnewsbycustomer = function(customer_id,count){
  return new Promise((resolve, reject)=>{
    NewsContents.getnewcontents(customer_id,count,function(err, news){
      if(news){
        resolve(news);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.gethotandnewproductsbycustomer = function(customer_id,count){
  return new Promise((resolve, reject)=>{
    productlists.gethotandnewproducts(customer_id,count,function(err, countproduct){
      if(countproduct){
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var salepec = parseInt(((productiteam.sale_price-productiteam.price)/productiteam.sale_price)*100);
          productiteam.alt=countproduct[x].detail[0].name;
          if(productiteam.sale==1){
            productiteam.salepec = salepec;
          }
          if(productiteam.hot==0){
            productiteam.hot = undefined;
          }
          if(productiteam.new==0){
            productiteam.new = undefined;
          }
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else{
        resolve({});
      }
    });
  })
}
module.exports.policies  = require('./policies')