const ProductCat = require('../models/productcats');
const NewsCats = require('../models/newscats');
const Seourls = require('../models/seourl');
const website = require('../models/websites');
const menu = require('../models/menu');
const footer = require('../models/footer');
const productlists = require('../models/productlists');
const productmoreinfo = require('../models/productmoreinfo');
let fs = require('fs');
const sharp = require('sharp');
const allowedExtension = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
]
module.exports.validateImageType = function (type) {
  if (allowedExtension.indexOf(type) > -1) {
      return true
  } else {
      return false
  }
}
module.exports.createImage = function (imagePath, imageData, width, ratio) {
  try {
      let height = ratio * width
      const uri = imageData.split(';base64,').pop()
      let out = fs.createWriteStream(imagePath)
      let imgBuffer = Buffer.from(uri, 'base64');
      sharp(imgBuffer).resize(Math.round(width), Math.round(height), {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0},
      }).webp({ lossless: true, quality: 100 }).pipe(out);
  } catch (err) {
      console.log(err)
  }
}

module.exports.gethotproductcat = function (customer_id) {
  return new Promise((resolve, reject) => {
    var listcat = '';
    ProductCat.getrootproductcats(customer_id, async function (err, productcatroot) {
      for (var x in productcatroot) {
        listcat = listcat + '<li class="product_menu_item"><span><a href="/' + productcatroot[x].seo_url + '">' + productcatroot[x].detail[0].name + '</a><i class="fa fa-caret-right"></i></span>';
        var listcat1 = await rendercatsbyparent(customer_id, productcatroot[x].cat_id, '');
        listcat = listcat + listcat1;
        listcat = listcat + '</li>';
      }
      resolve(listcat);
    });
  });
}
//Lấy danh sách danh mục sản phẩm hot theo customer
module.exports.gethotproductcategory = function (customer_id) {
  return new Promise((resolve, reject) => {
    var listcat = '';
    ProductCat.gethotproductcategory(customer_id, async function (err, productcategory) {
      if (productcategory) {
        resolve(productcategory);
      }
      else {
        resolve({});
      }
    });
  });
}
module.exports.getproductmenu = function (customer_id) {
  return new Promise((resolve, reject) => {
    var listcat = '';
    website.getwebsitesbycustomerid(customer_id, function (err, websiteinfo) {
      ProductCat.getrootproductcats(customer_id, async function (err, productcatroot) {
        for (var x in productcatroot) {
          let icon = '';
          let icon_font = productcatroot[x].icon_font ? productcatroot[x].icon_font : null;
          let icon_image = productcatroot[x].icon ? productcatroot[x].icon : null;
          if (icon_font) {
            icon = `<i class="${icon_font}"></i>`
          }
          else if (icon_image) {
            icon = '<img src="' + productcatroot[x].icon + '" alt="menu icon">'
          }
          listcat = listcat + '<li class="product_menu_item"><a href="/' + productcatroot[x].seo_url + '">'
            + '<i class="menu-icon img-icon">'
            + icon
            + '</i><span>' + productcatroot[x].detail[0].name + '</span></a>';
          var listcat1 = await rendercatsbyparent(customer_id, productcatroot[x].cat_id, '');
          listcat = listcat + listcat1;
          listcat = listcat + '</li>';
        }
        resolve(listcat);
      });
    })
  });
}
function rendercatsbyparent(customer_id, parent_id, listcat) {
  return new Promise((resolve, reject) => {
    ProductCat.getproductcatsbyparent(customer_id, Number(parent_id), async function (err, productcat) {
      if (productcat.length > 0) {
        listcat = listcat + '<ul>';
        for (var x in productcat) {
          listcat = listcat + '<li><span><a href="/' + productcat[x].seo_url + '">' + productcat[x].detail[0].name + '</a></span>';
          if (productcat[x].list_child.length == 0 || productcat[x].list_child[0] == undefined) {
          }
          else {
            var temp = await rendercatsbyparent(customer_id, productcat[x].cat_id, listcat);
            listcat = temp;
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
module.exports.rendermainmenu = async function (customer_id,lang) {
  return new Promise((resolve, reject) => {
    menu.getrootmenu(customer_id, async function (err, menuroot) {
      var listcat = '<ul class="ul_mainmenu" id="nav">';
      for (var x in menuroot) {
        const listcat1 = await renderrootmenuparent(customer_id, menuroot[x].cat_id, '', lang);
        let haveChild = '';
        if (listcat1) {
          haveChild = 'have-child'
        }
        let tranData = menuroot[x].detail.find(obj => obj.lang == lang)?menuroot[x].detail.find(obj => obj.lang == lang):menuroot[x].detail.find(obj => obj.lang == 'vi')
        if(lang=='vi'){
          listcat = listcat + '<li class="mainmenu_item"><span><a class = "'+haveChild+'"  href="/' + menuroot[x].link + '">' + tranData.name + '</a></span>';
        }
        else{
          listcat = listcat + '<li class="mainmenu_item"><span><a href="/'+lang+'/' + menuroot[x].link + '">' + tranData.name + '</a></span>';
        }
        
        listcat = listcat + listcat1;
        listcat = listcat + '</li>';
      }
      listcat = listcat + '</ul>';
      resolve(listcat);
    });
  });
}
function renderrootmenuparent(customer_id, parent_id, listcat,lang = 'vi') {
  return new Promise((resolve, reject) => {
    menu.getmenubyparent(customer_id, Number(parent_id), async function (err, productcat) {
      if (productcat.length > 0) {
        listcat = listcat + '<ul>';
        for (var x in productcat) {
          let tranData = productcat[x].detail.find(obj => obj.lang == lang)?productcat[x].detail.find(obj => obj.lang == lang):productcat[x].detail.find(obj => obj.lang == 'vi')
          if(lang=='vi'){
            listcat = listcat + '<li><span><a href="/' + productcat[x].link + '">' + tranData.name + '</a></span>';
          }
          else{
            listcat = listcat + '<li><span><a href="/'+lang+'/' + productcat[x].link + '">' + tranData.name + '</a></span>';
          }
          if (productcat[x].list_child.length == 0 || !productcat[x].list_child[0]) {
          }
          else {
            var temp = await renderrootmenuparent(customer_id, productcat[x].cat_id, listcat);
            listcat = temp;
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
module.exports.getWebsiteByUrl = async function (url) {
  const query = { website_url: url };
  return await website.findOne(query).exec();
}
module.exports.getfooterbycustomer = function (customer_id) {
  return new Promise((resolve, reject) => {
    footer.getfooterbycustomer(customer_id, function (err, footerinfo) {
      if (footerinfo) {
        resolve(footerinfo)
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.getwebsitebyseourl = function (customer_id, seo_url) {
  return new Promise((resolve, reject) => {
    Seourls.findByUrl(customer_id, seo_url, async function (err, website) {
      if (website) {
        resolve(website)
      }
      else {
        resolve(null);
      }
    });
  })
}
module.exports.gettemplates = function () {
  return new Promise((resolve, reject) => {
    website.gettemplatewebsites(8, async function (error, templatewebsite) {
      if (templatewebsite) {
        resolve(templatewebsite)
      }
      else {
        resolve([]);
      }
    })
  })
}
module.exports.gethotproductbycustomer = function (customer_id, count, products_name_letters) {
  return new Promise((resolve, reject) => {
    productlists.gethotproducts(customer_id, count, function (err, countproduct) {
      if (countproduct) {
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = productiteam.price ? String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') : '';
          var sale_pricebeauty = productiteam.sale_price ? String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') : '';
          var productname = countproduct[x].detail[0].name;
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;
          var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
          productiteam.alt = countproduct[x].detail[0].name;
          productiteam.productname = productname;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          if (productiteam.hot == 0) {
            productiteam.hot = undefined;
          }
          if (productiteam.new == 0) {
            productiteam.new = undefined;
          }
          productiteam.rating = productiteam?.rating || 0;
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.getnewproductbycustomer = function (customer_id, count, products_name_letters) {
  return new Promise((resolve, reject) => {
    productlists.getnewproducts(customer_id, count, function (err, countproduct) {
      if (countproduct) {
        let i = 1;
        let css_class = "";
        for (var x in countproduct) {
          let itemposition = i % 2
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          css_class = `item${i} item_pos${itemposition}`;
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;

          let salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);

          productiteam.alt = countproduct[x].detail[0].name;
          productiteam.productname = productname;
          productiteam.css_class = css_class;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          countproduct[x] = productiteam;
          i++;
        }
        resolve(countproduct);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.getSaleProductsbyCustomer = function (customer_id, count) {
  return new Promise((resolve, reject) => {
    productlists.getSaleProducts(customer_id, count, function (err, countproduct) {
      if (countproduct) {
        let i = 1;
        let css_class = "";
        for (var x in countproduct) {
          let itemposition = i % 2
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          css_class = `item${i} item_pos${itemposition}`;
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;

          let salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);

          productiteam.alt = countproduct[x].detail[0].name;
          productiteam.productname = productname;
          productiteam.css_class = css_class;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          countproduct[x] = productiteam;
          i++;
        }
        resolve(countproduct);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.getallchoiseproductmoreinfos = function (customer_id) {
  return new Promise((resolve, reject) => {
    productmoreinfo.getallchoiseproductmoreinfo(customer_id, function (err, countproduct) {
      if (countproduct) {
        resolve(countproduct);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.getproductbyproductmoreinfos = function (customer_id, num) {
  return new Promise((resolve, reject) => {
    productmoreinfo.getallchoiseproductmoreinfo(customer_id, function (err, countproduct) {
      if (countproduct.length > 0) {
        var product_more_infos = JSON.parse(JSON.stringify(countproduct[0].default_value));
        for (const x in product_more_infos) {
          product_more_infos[x].list_products = {};
          let id = product_more_infos[x].default_id;
          productlists.getproductsbymoreinfo(customer_id, num, id, function (err, products) {
            let temp = JSON.parse(JSON.stringify(products))
            product_more_infos[x].list_products = temp
          })
        }
        resolve(product_more_infos);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.gettopnewscatsandcontent = function (customer_id, count, callback) {
  NewsCats.gethotnewcatbyrank(customer_id, count, function (err, countproduct) {
    if (countproduct) {
      for (var x in countproduct) {
        var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = countproduct[x].detail[0].name;
        countproduct[x] = productiteam;
      }
      return callback(null, countproduct);
      //resolve(countproduct);
    }
    else {
      return callback(null, []);
    }
  });
}
module.exports.gethotandnewproductsbycustomer = function (customer_id, count) {
  return new Promise((resolve, reject) => {
    productlists.gethotandnewproducts(customer_id, count, function (err, countproduct) {
      if (countproduct) {
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
          productiteam.alt = countproduct[x].detail[0].name;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          if (productiteam.hot == 0) {
            productiteam.hot = undefined;
          }
          if (productiteam.new == 0) {
            productiteam.new = undefined;
          }
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else {
        resolve({});
      }
    });
  })
}
module.exports.policies = require('./policies')
module.exports.advertises = require('./advertises')
module.exports.testimonials = require('./testimonials');
module.exports.socialmedias = require('./socialmedias');
module.exports.newpages = require('./newspages');
module.exports.partners = require('./partners');
module.exports.address = require('./address');
module.exports.news = require('./newscontents');
module.exports.banners = require('./banners');