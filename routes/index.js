var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var newspages = require('../models/newspages');
var NewsContents = require('../models/newscontents');
var NewsCats = require('../models/newscats');
var Productlists = require('../models/productlists');
var ProductCat = require('../models/productcats');
var listorders = require('../models/listorders');
const utils = require('../models/utils');
var website = require('../models/websites');
const {
  countWebsitesTemplate,
  getAllWebsiteTemplateByPage
} = require('../models/websites');
var customers = require('../models/customers');
var systems = require('../models/systems');
var caches = require('../models/cache');
var User = require('../models/register');
var province = require('../models/province');
var productmoreinfo = require('../models/productmoreinfo');
const request = require('request');
var i18n = require('i18n');
router.get('/website-mau', async function (req, res, next) {
  let language = i18n.getLocale();
  let homelang = language
  if (language == 'vi') {
    homelang = ''
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  let hotnews = caches.hotnews[hostname];
  hotnews = utils.filterDetailByLang(hotnews,language,1)
  let per_page = 30;
  let [count, listTemplate] = await Promise.all([countWebsitesTemplate(), getAllWebsiteTemplateByPage()])
  var allpage = (count / per_page) + 1;
  var arraypage = [];
  for (var i = 1; i <= allpage; i++) {
    var temp = {
      pagecount: i,
      seo_url: 'website-mau'
    }
    arraypage.push(temp);
  };
  var customer_username = websiteinfo.customer_username
  res.render('content/' + customer_username + '/websitetemplate', {
    title: 'Giao diện website mẫu, template website miễn phí',
    listtemplates: listTemplate,
    siteinfo: websiteinfo,
    arraypage: arraypage,
    hotnews: hotnews,
    language: language,
    lang: homelang,
    layout: websiteinfo.customer_username,
  });
});
router.get('/getcart', function (req, res, next) {
  if (req.session.products) {
    res.send(req.session.products.length.toString());
  }
  else {
    res.send("0")
  }
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/login', function (req, res, next) {
  var hostname = req.headers.host;
  var productmenu = caches.productcat[hostname];
  var mainmenu = caches.mainmenu[hostname];
  website.getwebsitesbyurl(hostname, async function (error, websiteinfo) {
    var customer_username = websiteinfo.customer_username;
    res.render('content/' + customer_username + '/login', {
      title: 'Đăng nhập',
      layout: customer_username,
      productmenu: productmenu,
      mainmenu: mainmenu,
      siteinfo: websiteinfo,
    });
  })
});
router.get('/clearcache', function (req, res, next) {
  var hostname = req.headers.host;
  caches.productcat[hostname] = null;
  caches.hotnewcats[hostname] = null;
  caches.websiteinfo[hostname] = null;
  caches.mainmenu[hostname] = null;
  caches.hotproducts[hostname] = null;
  caches.hotproductcats[hostname] = null;
  caches.newproducts[hostname] = null;
  caches.productmoreinfos[hostname] = null;
  caches.provinces[hostname] = null;
  caches.productmoreinfos[hostname] = null;
  caches.productmenu[hostname] = null;
  caches.list_products_by_more_info[hostname] = null;
  caches.hotproductcategory[hostname] = null;
  caches.hotandnewproducts[hostname] = null;
  res.send('ok');
})
router.get('/lien-he', function (req, res, next) {
  let language = i18n.getLocale();
  let homelang = language
  if (language == 'vi') {
    homelang = ''
  }
  let hostname = req.headers.host;
  let websiteinfo = caches.websiteinfo[hostname];
  let productmenu = caches.productcat[hostname];
  let sitefooter = caches.footer[hostname];
  let customer_username = websiteinfo.customer_username;
  let mainmenu = caches.mainmenu[hostname];
  let productmoreinfos = caches.productmoreinfos[hostname];
  let hotnews = caches.hotnews[hostname];
  hotnews = utils.filterDetailByLang(hotnews,language)
  res.render('content/' + customer_username + '/contact', {
    title: 'Liên hệ',
    layout: customer_username,
    productmenu: productmenu,
    mainmenu: mainmenu,
    layout: customer_username,
    siteinfo: websiteinfo,
    sitefooter: sitefooter,
    hotnews: hotnews,
    language: language,
    lang:homelang,
    productmoreinfos: productmoreinfos
  });
});
router.get('/thankorder', async function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var productmenu = caches.productcat[hostname];
  var sitefooter = caches.footer[hostname];
  var mainmenu = caches.mainmenu[hostname];
  var newproducts = caches.newproducts[hostname];
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_username = websiteinfo.customer_username;
  var productmoreinfos = caches.productmoreinfos[hostname];
  res.render('content/' + customer_username + '/thankorder', {
    productmenu: productmenu,
    mainmenu: mainmenu,
    newproducts: newproducts,
    siteinfo: websiteinfo,
    title: '',
    layout: customer_username,
    sitefooter: sitefooter,
    productmoreinfos: productmoreinfos
  });
});
router.get('/gio-hang', async function (req, res, next) {
  if (!caches.provinces || caches.provinces == null) {
    var province1 = await getcartprovinces();
    caches.provinces = province1
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var productmenu = caches.productcat[hostname];
  var sitefooter = caches.footer[hostname];
  var customer_username = websiteinfo.customer_username
  var listproduct = req.session.products;
  var mainmenu = caches.mainmenu[hostname];
  var newproducts = caches.newproducts[hostname];
  var provinces = caches.provinces;
  var productmoreinfos = caches.productmoreinfos[hostname];
  res.render('content/' + customer_username + '/shoppingcart', {
    listproducts: listproduct,
    total_money: req.session.total_price,
    total_price_pricebeauty: req.session.total_price_pricebeauty,
    title: 'Giỏ hàng',
    layout: websiteinfo.customer_username,
    productmenu: productmenu,
    mainmenu: mainmenu,
    layout: customer_username,
    siteinfo: websiteinfo,
    sitefooter: sitefooter,
    newproducts: newproducts,
    provinces: provinces,
    productmoreinfos: productmoreinfos
  });
});

router.get('/tim-kiem', async function (req, res, next) {
  var key = req.param('key', '');
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var productmenu = caches.productcat[hostname];
  var sitefooter = caches.footer[hostname];
  var customer_username = websiteinfo.customer_username
  var mainmenu = caches.mainmenu[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  Productlists.findproductbykey(key, websiteinfo.customer_id, function (err, countproduct) {
    for (var x in countproduct) {
      var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
      var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var productname = countproduct[x].detail[0].name;
      if (productname.length > websiteinfo.products_name_letters) {
        productname = countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters) + "...";
      }
      productiteam.pricebeauty = pricebeauty;
      productiteam.sale_pricebeauty = sale_pricebeauty;
      var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
      productiteam.alt = countproduct[x].detail[0].name;
      productiteam.productname = productname;
      if (productiteam.sale == 1) {
        productiteam.salepec = salepec;
      }
      countproduct[x] = productiteam;
    }
    res.render('content/' + customer_username + '/search', {
      contents: countproduct,
      title: 'Tìm kiếm sản phẩm',
      layout: customer_username,
      productmenu: productmenu,
      mainmenu: mainmenu,
      layout: customer_username,
      siteinfo: websiteinfo,
      sitefooter: sitefooter,
      newproducts: newproducts,
      productmoreinfos: productmoreinfos
    });
  })
});

router.get('/san-pham-ban-chay', async function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var per_page = websiteinfo.products_per_page;
  var customer_username = websiteinfo.customer_username;
  var customer_id = websiteinfo.customer_id;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var page = req.param('page', '1');
  Productlists.counthotproducts(customer_id, function (err, count) {
    Productlists.getallhotproductsbypage(customer_id, page, per_page, async function (err, conten) {
      for (var x in conten) {
        var productiteam = JSON.parse(JSON.stringify(conten[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = conten[x].detail[0].name;
        conten[x] = productiteam;
      }
      var allpage = (count / per_page) + 1;
      var arraypage = [];
      for (var i = 1; i <= allpage; i++) {
        var temp = {
          pagecount: i,
          seo_url: "san-pham-ban-chay"
        }
        arraypage.push(temp);
      };
      res.render('content/' + customer_username + '/hotproduct', {
        contents: conten,
        allpage: arraypage,
        title: "Sản phẩm bán chạy",
        canonical: '/san-pham-moi',
        description: "catinfo.detail[0].description",
        keyword: "catinfo.detail[0].keyword",
        layout: customer_username,
        productmenu: productmenu,
        mainmenu: mainmenu,
        siteinfo: websiteinfo,
        sitefooter: sitefooter,
        newproducts: newproducts,
        productmoreinfos: productmoreinfos
      });
    })
  })
});
router.get('/san-pham-moi', async function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var per_page = websiteinfo.products_per_page;
  var customer_username = websiteinfo.customer_username;
  var customer_id = websiteinfo.customer_id;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var page = req.param('page', '1');
  Productlists.countnewproducts(customer_id, function (err, count) {
    Productlists.getallnewproductsbypage(customer_id, page, per_page, async function (err, conten) {
      for (var x in conten) {
        var productiteam = JSON.parse(JSON.stringify(conten[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = conten[x].detail[0].name;
        conten[x] = productiteam;
      }
      var allpage = (count / per_page) + 1;
      var arraypage = [];
      for (var i = 1; i <= allpage; i++) {
        var temp = {
          pagecount: i,
          seo_url: 'san-pham-moi'
        }
        arraypage.push(temp);
      };
      res.render('content/' + customer_username + '/hotproduct', {
        contents: conten,
        allpage: arraypage,
        title: "Sản phẩm mới về",
        canonical: '/san-pham-moi',
        description: "catinfo.detail[0].description",
        keyword: "catinfo.detail[0].keyword",
        layout: customer_username,
        productmenu: productmenu,
        mainmenu: mainmenu,
        siteinfo: websiteinfo,
        sitefooter: sitefooter,
        newproducts: newproducts,
        productmoreinfos: productmoreinfos
      });
    })
  })
});
router.get('/getdistrictbyprovinces', function (req, res, next) {
  var provinceid = req.param('provinceid');
  var temp = provinceid.split(";");
  var raw = 1457;
  if (Number(temp[0]) != NaN) {
    raw = JSON.stringify({ "province_id": Number(temp[0]) });
  }
  const options = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': '8df4cc58-7c87-11eb-9035-ae038bcc764b'
    },
    body: raw,
  };
  request(options, function (err, res1, body) {
    let json = JSON.parse(body);
    var districts = '<option value="0">--Vui lòng chọn--</option>';
    var temp = json.data;
    for (var x in temp) {
      if (temp[x].DistrictID != 3442 && temp[x].DistrictID != 3450 && temp[x].DistrictID != 3448 && temp[x].DistrictID != 3449 && temp[x].DistrictID != 1580) {
        districts = districts + '<option value="' + temp[x].DistrictID + ';' + temp[x].DistrictName + '">' + temp[x].DistrictName + '</option>';
      }
    }
    res.send(districts);
  });
});
router.get('/getwardbydistrict', function (req, res, next) {
  var districtid = req.param('districtid');
  var temp = districtid.split(";");
  var raw = 3286;
  if (Number(temp[0]) != NaN) {
    raw = JSON.stringify({ "district_id": Number(temp[0]) });
  }
  const options = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': '8df4cc58-7c87-11eb-9035-ae038bcc764b'
    },
    body: raw,
  };
  request(options, function (err, res1, body) {
    let json = JSON.parse(body);
    var districts = '<option value="0" select="selected">--Vui lòng chọn--</option>';
    var temp = json.data;
    for (var x in temp) {
      districts = districts + '<option value="' + temp[x].WardCode + ';' + temp[x].WardName + '">' + temp[x].WardName + '</option>';
    }
    res.send(districts);
  });
});
router.get('/getshippingcod', function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var districtid1 = req.param('districtid');
  var temp = districtid1.split(";");
  var districtid = 3286;
  if (Number(temp[0]) != NaN) {
    districtid = Number(temp[0]);
  }
  var wardid1 = req.param('wardid');
  var temp1 = wardid1.split(";");
  var wardid = 471009;
  if (Number(temp1[0]) != NaN) {
    wardid = Number(temp[0]);
  }

  var temp1 = {
    "shop_id": 102838,
    "from_district": 1457,
    "to_district": Number(districtid)
  }

  var raw1 = JSON.stringify(temp1);
  const options1 = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': '7b0a7cf5-7c86-11eb-9035-ae038bcc764b',
    },
    body: raw1,
  };
  request(options1, function (err, res1, body) {
    console.log(body.data)
    let json = JSON.parse(body);
    var serviceid = 0
    if (body.data) {
      serviceid = json.data[0].service_id;
    }
    else {
      serviceid = 0;
    }
    var temp = {
      'from_district_id': Number(websiteinfo.from_district_id),
      'service_id': Number(serviceid),
      'service_type_id': null,
      'to_district_id': Number(districtid),
      'to_ward_code': wardid,
      'height': 10,
      'length': 10,
      'weight': 200,
      'width': 10,
      'insurance_value': 0,
      'coupon': null
    }
    var raw = JSON.stringify(temp);
    const options = {
      url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': '8df4cc58-7c87-11eb-9035-ae038bcc764b',
        'ShopId': 102838,
      },
      body: raw,
    };
    request(options, function (err, res1, body) {
      let json = JSON.parse(body);
      if (json.data) {
        var temp = json.data.total;
        res.send(temp.toString());
      }
      else {
        res.send('30000');
      }
    });
  });
});
const renderhomepage = async function (req, res, language) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var product_per_cat_home = 0;
  if (websiteinfo && websiteinfo.products_per_cat_home) {
    product_per_cat_home = websiteinfo.products_per_cat_home;
  }
  var sitefooter = caches.footer[hostname];
  var mainmenu = caches.mainmenu[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var list_products_by_more_info = caches.list_products_by_more_info[hostname];
  let listtemplates = [];
  let testimonials = [];
  let cusbanner = [];
  let promises = []
  if (hostname === 'tns.vn' || (process.env.ENV === 'local' && hostname === 'template1.tns.vn:3005') || hostname === 'tnsviet.online') {
    promises.push(systems.gettestimonialsbycustomer(websiteinfo.customer_id), systems.gettemplates(), systems.getbanner(websiteinfo.customer_id))
  }
  else {
    promises.push([], [], systems.getbanner(websiteinfo.customer_id))
  }
  [testimonials, listtemplates, cusbanner] = await Promise.all(promises).catch(function (err) { console.log(err) })
  var hotproducts = caches.hotproducts[hostname];
  var newproducts = caches.newproducts[hostname];
  var hotproductcategory = caches.hotproductcategory[hostname];
  let hotandnewproducts = caches.hotandnewproducts[hostname];
  let hotnews = caches.hotnews[hostname];
  let policies = caches.policies[hostname]?caches.policies[hostname]:[];
  hotnews = utils.filterDetailByLang(hotnews,language)
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  let homelang = ''
  let lang = 'vi'
  if (websiteinfo.website_url === hostname) {
    var customer_username = websiteinfo.customer_username;
    if (!caches.hotproductcats[hostname] || caches.hotproductcats[hostname] == null) {
      var hotproductcats = await gethotproductcat(websiteinfo.customer_id, product_per_cat_home, websiteinfo.products_name_letters);
      caches.hotproductcats[hostname] = hotproductcats;
    }
    var productcat = caches.hotproductcats[hostname]
    let tranData = {}
    if (websiteinfo.multi_language == 1) {
      if (language != 'vi') {
        lang = language
        homelang = language
      }
      tranData = websiteinfo.detail.find(obj => obj.lang == lang)
    }
    res.render('content/' + customer_username + '/index', {
      productcats: productcat,
      canonical: website_protocol + '://' + hostname + '/' + homelang,
      title: tranData && tranData.title ? tranData.title : websiteinfo.title,
      description: tranData && tranData.description ? tranData.description : websiteinfo.description,
      keyword: tranData && tranData.keyword ? tranData.keyword : websiteinfo.keyword,
      banners: cusbanner,
      productmenu: productmenu,
      mainmenu: mainmenu,
      layout: customer_username,
      siteinfo: websiteinfo,
      sitefooter: sitefooter,
      hotproducts: hotproducts,
      newproducts: newproducts,
      productmoreinfos: productmoreinfos,
      list_products_by_more_info: list_products_by_more_info,
      productmenu1: productmenu1,
      hotproductcategory: hotproductcategory,
      hotandnewproducts: hotandnewproducts,
      hotnews: hotnews,
      listtemplates: listtemplates,
      testimonials: testimonials,
      policies:policies,
      language: language,
      lang: homelang,
      ishomepage:1
    });
  }
  else {
    res.render('content/template1/error404', {
      canonical: hostname + '/',
      layout: 'template1',
    });
  }
}
const renderpage = async function (req, res, website_url,language='vi') {
  let homelang = language
  if (language == 'vi') {
    homelang = ''
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  let hotnews = caches.hotnews[hostname];
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  newspages.getNewsPagesById(customer_id, website_url.content_id, function (err, conten) {
    let tranData = null
    let canonical = conten.seo_url
    if (websiteinfo.multi_language == 1) {
      if (language != 'vi') {
        lang = language
        homelang = language
      }
      canonical = language+'/'+canonical
      tranData = conten.detail.find(obj => obj.lang == language);
      hotnews = utils.filterDetailByLang(hotnews,language,1)
    }
    res.render('content/' + customer_username + '/page', {
      contents: conten,
      details:tranData?tranData: conten.detail[0],
      title:tranData&&tranData.title?tranData.title: conten.detail[0].title,
      description: tranData && tranData.description ? tranData.description : conten.detail[0].description,
      keyword: tranData && tranData.keyword ? tranData.keyword : conten.detail[0].keyword,
      canonical:website_protocol+'/'+hostname+'/'+canonical,
      layout: customer_username,
      productmenu: productmenu,
      productmenu1:productmenu1,
      mainmenu: mainmenu,
      siteinfo: websiteinfo,
      sitefooter: sitefooter,
      newproducts: newproducts,
      language: language,
      lang: homelang,
      hotnews:hotnews,
      productmoreinfos: productmoreinfos
    });
  });
}
const rendernewcontentpage = async function (req, res, website_url,language='vi') {
  let homelang = language
  if (language == 'vi') {
    homelang = ''
  }
  let hostname = req.headers.host;
  let websiteinfo = caches.websiteinfo[hostname];
  let customer_username = websiteinfo.customer_username;
  let mainmenu = caches.mainmenu[hostname];
  let productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  let sitefooter = caches.footer[hostname];
  let newproducts = caches.newproducts[hostname];
  let productmoreinfos = caches.productmoreinfos[hostname];
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  let hotnews = caches.hotnews[hostname];
  NewsContents.getnewscontentbycontentid(website_url.content_id, function (err, conten) {
    NewsContents.getratenewcontentbycatcount(conten.parent_id, conten.content_id, 8, function (err, ratenews) {
      let tranData = null
      let canonical = conten.seo_url
      if (websiteinfo.multi_language == 1) {
        if(language!='vi'){
          canonical = language+'/'+canonical
        }
        tranData = conten.detail.find(obj => obj.lang == language)
        ratenews = utils.filterDetailByLang(ratenews,language,1)
        hotnews = utils.filterDetailByLang(hotnews,language,1)
      }
      res.render('content/' + customer_username + '/newscontent', {
        contents: conten,
        hotnews: hotnews,
        ratenews: ratenews,
        details: tranData?tranData:conten.detail[0],
        title: tranData&&tranData.title?tranData.title:conten.detail[0].title,
        description: tranData&&tranData.description?tranData.description:conten.detail[0].description,
        keyword: tranData&&tranData.keyword?tranData.keyword:conten.detail[0].keyword,
        canonical: website_protocol + '://' + hostname + '/' + canonical,
        orgimage: website_protocol + '://' + hostname + '/static/'+customer_username+'/images/news/fullsize/' + conten.image2,
        layout: customer_username,
        productmenu: productmenu,
        productmenu1:productmenu1,
        mainmenu: mainmenu,
        siteinfo: websiteinfo,
        sitefooter: sitefooter,
        newproducts: newproducts,
        language: language,
        lang:homelang,
        productmoreinfos: productmoreinfos
      });
    });
  });
}
const rendernewcatpage = async function (req, res, website_url, language = 'vi') {
  let homelang = language
  if (language == 'vi') {
    homelang = ''
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var per_page = 18;
  var page = req.param('page', '1');
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  let hotnews = caches.hotnews[hostname];
  let hotnews1 = utils.filterDetailByLang(hotnews,language,1)
  NewsCats.getnewscatsbycatid(customer_id, website_url.content_id, async function (err, newcatinfo) {
    let newsCatData = null
    if (websiteinfo.multi_language == 1) {
      newsCatData = newcatinfo.detail.find(obj => obj.lang == language)
    }
    let [count, conten] = await Promise.all([countnewsbycat(newcatinfo.cat_id), NewsContents.getnewsnontentsbycatcount(website_url.content_id, page, per_page)])
    var allpage = (count / per_page) + 1;
    var arraypage = [];
    for (var i = 1; i <= allpage; i++) {
      var temp = {
        pagecount: i,
        seo_url: newcatinfo.seo_url
      }
      arraypage.push(temp);
    };
    if(language=='vi'){
      conten = utils.filterDetailByLang(conten,language,0)
    }
    else{
      conten = utils.filterDetailByLang(conten,language,1)
    }
    res.render('content/' + customer_username + '/newscat', {
      contents: conten,
      hotnews: hotnews1,
      allpage: arraypage,
      newscatinfo: newcatinfo,
      newcatdetail: newsCatData ? newsCatData : newcatinfo.detail[0],
      title: newsCatData ? newsCatData.title : newcatinfo.detail[0].title,
      description: newsCatData ? newsCatData.description : newcatinfo.detail[0].description,
      keyword: newsCatData ? newsCatData.keyword : newcatinfo.detail[0].keyword,
      canonical: language ? website_protocol + '://' + hostname + '/' + language + '/' + newcatinfo.seo_url + '/' : website_protocol + '://' + hostname + '/' + newcatinfo.seo_url + '/',
      orgimage: website_protocol + '://' + hostname + '/images/news/fullsize/' + conten.image,
      productmenu: productmenu,
      productmenu1:productmenu1,
      mainmenu: mainmenu,
      siteinfo: websiteinfo,
      sitefooter: sitefooter,
      newproducts: newproducts,
      language: language,
      lang:homelang,
      productmoreinfos: productmoreinfos,
      layout: customer_username
    });
  });
}
const renderproductcatpage = async function (req, res, website_url) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var hotproducts = caches.hotproducts[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var per_page = websiteinfo.products_per_page?websiteinfo.products_per_page:24;
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  var page = req.param('page', '1');
  var count = await countproductsbycat(website_url.content_id);
  var catinfo = await getproductcatinfo(website_url.content_id);
  let language = i18n.getLocale();
  if (language == 'vi')
    language = ''
  Productlists.getallproductbycatshow(customer_id, website_url.content_id, Number(page), per_page, async function (err, countproduct) {
    for (var x in countproduct) {
      var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
      var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var productname = countproduct[x].detail[0].name;
      if (productname.length > websiteinfo.products_name_letters) {
        productname = countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters) + "...";
      }
      productiteam.pricebeauty = pricebeauty;
      productiteam.sale_pricebeauty = sale_pricebeauty;
      var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
      productiteam.alt = countproduct[x].detail[0].name;
      productiteam.productname = productname;
      if (productiteam.sale == 1) {
        productiteam.salepec = salepec;
      }
      countproduct[x] = productiteam;
    }
    var allpage = (count / per_page) + 1;
    var arraypage = [];
    for (var i = 1; i <= allpage; i++) {
      var temp = {
        pagecount: i,
        seo_url: catinfo.seo_url
      }
      arraypage.push(temp);
    };
    res.render('content/' + customer_username + '/productscat', {
      contents: countproduct,
      allpage: arraypage,
      newscatinfo: countproduct,
      productcatinfo: catinfo.detail[0],
      title: catinfo.detail[0].title,
      canonical: website_protocol + '://' + hostname + '/' + catinfo.seo_url + '/',
      description: catinfo.detail[0].description,
      keyword: catinfo.detail[0].keyword,
      layout: customer_username,
      productmenu: productmenu,
      productmenu1:productmenu1,
      mainmenu: mainmenu,
      siteinfo: websiteinfo,
      sitefooter: sitefooter,
      newproducts: newproducts,
      language: language,
      productmoreinfos: productmoreinfos,
      hotproducts:hotproducts
    });
  });
}
const renderproductdetailpage = async function (req, res, website_url) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_username = websiteinfo.customer_username;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  let language = i18n.getLocale();
  if (language == 'vi')
    language = ''
  Productlists.getproductbyproductid(website_url.content_id, async function (err, conten) {
    Productlists.getrateproductlistscatcount(conten.parent_id, conten.product_id, 8, function (err, rateproducts) {
      for (var x in rateproducts) {
        var productiteam = JSON.parse(JSON.stringify(rateproducts[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = rateproducts[x].detail[0].name;
        rateproducts[x] = productiteam;
      }

      var procontent = JSON.parse(JSON.stringify(conten.detail[0]));
      var product_details = conten.product_detail;
      var product_more_info = conten.product_more_info;
      for (var x in product_more_info) {
        if (product_more_info[x].status == 1) {
          product_more_info[x].status = undefined
        }
        if (product_more_info[x].status == 1) {
          product_more_info[x].status = undefined
        }
      }
      var pricebeauty = String(conten.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var islogin = undefined;
      var instock = undefined;
      if (req.user) {
        islogin = 1;
      }
      if (conten.show == 1) {
        instock = 1;
      }
      res.render('content/' + customer_username + '/productdetail', {
        description: conten.detail[0].description,
        canonical: website_protocol + '://' + hostname + '/' + conten.seo_url,
        orgimage: website_protocol + '://' + hostname + '/images/products/fullsize/' + conten.image2,
        contents: conten,
        product_details: product_details,
        price: pricebeauty,
        details: procontent,
        title: conten.detail[0].title,
        layout: customer_username,
        productmenu: productmenu,
        productmenu1:productmenu1,
        instock: instock,
        product_more_info: product_more_info,
        islogin: islogin,
        mainmenu: mainmenu,
        siteinfo: websiteinfo,
        sitefooter: sitefooter,
        rateproducts: rateproducts,
        newproducts: newproducts,
        language: language,
        productmoreinfos: productmoreinfos
      });
    });
  });
}
const renderproductmoreinfocategorypage = async function (req, res, website_url) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  var per_page = websiteinfo.products_per_page;
  var page = req.param('page', '1');
  let website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : "http";
  let language = i18n.getLocale();
  if (language == 'vi')
    language = ''
  Productlists.countproductbymoreinfo(customer_id, website_url.content_id, async function (err, count) {
    productmoreinfo.getmoreinfovalue(customer_id, website_url.content_id, function (err, productmorein) {
      Productlists.getallproductbymoreinfo(customer_id, website_url.content_id, Number(page), per_page, async function (err, countproduct) {
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          if (productname.length > websiteinfo.products_name_letters) {
            productname = countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters) + "...";
          }
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;
          var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
          productiteam.alt = countproduct[x].detail[0].name;
          productiteam.productname = productname;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          countproduct[x] = productiteam;
        }
        var allpage = (count / per_page) + 1;
        var arraypage = [];
        for (var i = 1; i <= allpage; i++) {
          var temp = {
            pagecount: i,
            seo_url: productmorein[0].default_value[0].seo_url
          }
          arraypage.push(temp);
        };
        res.render('content/' + customer_username + '/productmoreinfo', {
          contents: countproduct,
          allpage: arraypage,
          newscatinfo: countproduct,
          productcatinfo: productmorein[0].default_value[0],
          title: productmorein[0].default_value[0].title,
          canonical: website_protocol + '://' + hostname + '/' + productmorein[0].default_value[0].seo_url + '/',
          description: productmorein[0].default_value[0].description,
          keyword: productmorein[0].default_value[0].keyword,
          layout: customer_username,
          productmenu: productmenu,
          productmenu1:productmenu1,
          mainmenu: mainmenu,
          siteinfo: websiteinfo,
          sitefooter: sitefooter,
          newproducts: newproducts,
          language: language,
          productmoreinfos: productmoreinfos
        });
      });
    })
  })
}
router.get('/', async function (req, res) {
  res.cookie('locale', 'vi');
  i18n.setLocale('vi');
  renderhomepage(req, res, 'vi')
});
router.get('/:seourl', async function (req, res, next) {
  var seourl = req.params.seourl;
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  switch (seourl) {
    case 'en':
      res.cookie('locale', 'en');
      i18n.setLocale('en');
      renderhomepage(req, res, i18n.getLocale());
      break;
    case 'vi':
      res.cookie('locale', 'vi');
      i18n.setLocale('vi');
      res.redirect('/');
      break;
    default:
      const website_url = await systems.getwebsitebyseourl(customer_id, seourl)
      if (!website_url) {
        if (customer_username) {
          res.render('content/' + customer_username + '/error404', {
            title: 'Lổi 404 không tìm thấy',
            layout: customer_username,
            canonical: hostname + '/error404',
            title: websiteinfo.title,
            description: websiteinfo.description,
            keyword: websiteinfo.keyword,
          });
        }
      }
      else {
        switch (website_url.type) {
          case 1:
            renderpage(req, res, website_url);
            break;
          case 2:
            rendernewcatpage(req, res, website_url, 'vi');
            break;
          case 3:
            rendernewcontentpage(req, res, website_url);
            break;
          case 4:
            renderproductcatpage(req, res, website_url);
            break;
          case 5:
            renderproductdetailpage(req, res, website_url);
            break;
          case 6:
            renderproductmoreinfocategorypage(req, res, website_url);
            break;
        }
      }
  }
});
router.get('/:seourl1/:selurl2', async function (req, res, next) {
  var seourl1 = req.params.seourl1;
  var seourl2 = req.params.selurl2;
  var seourl = seourl1 + '/' + seourl2;
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var customer_id = websiteinfo.customer_id;
  var customer_username = websiteinfo.customer_username;
  let lang = 'vi'
  if (seourl1.length === 2) {
    lang = seourl1;
    seourl = seourl2;
    switch (seourl1) {
      case 'en':
        res.cookie('locale', 'en');
        i18n.setLocale('en');
        break;
      case 'vi':
        res.cookie('locale', 'vi');
        i18n.setLocale('vi');
        break;
      default:
    }
  }
  else{
    res.cookie('locale', 'vi');
    i18n.setLocale('vi');
  }
  const website_url = await systems.getwebsitebyseourl(customer_id, seourl)
  if (!website_url) {
    if (customer_username) {
      res.render('content/' + customer_username + '/error404', {
        title: 'Lổi 404 không tìm thấy',
        layout: customer_username,
        canonical: hostname + '/error404',
        title: websiteinfo.title,
        description: websiteinfo.description,
        keyword: websiteinfo.keyword,
      });
    }
  }
  else {
    switch (website_url.type) {
      case 1:
        renderpage(req, res, website_url,lang);
        break;
      case 2:
        rendernewcatpage(req, res, website_url, lang);
        break;
      case 3:
        rendernewcontentpage(req, res, website_url,lang);
        break;
      case 4:
        renderproductcatpage(req, res, website_url);
        break;
      case 5:
        renderproductdetailpage(req, res, website_url);
        break;
      case 6:
        renderproductmoreinfocategorypage(req, res, website_url);
        break;
    }
  }

});
function gethotproductcat(customer_id, product_per_cat_home, products_name_letters) {
  return new Promise((resolve, reject) => {
    ProductCat.gethotrootproductcats(customer_id, async function (err, productcat) {
      var productcatdetail = JSON.parse(JSON.stringify(productcat));
      if (productcat) {
        for (var x in productcat) {
          var temp = await getproductbycatcout(customer_id, productcat[x].cat_id, product_per_cat_home, products_name_letters);
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
function getproductbycatcout(customer_id, cat_id, product_per_cat_home, products_name_letters) {
  return new Promise((resolve, reject) => {
    Productlists.getproductbycatcount(customer_id, cat_id, product_per_cat_home, function (err, countproduct) {
      if (countproduct) {
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          if (productname.length > products_name_letters) {
            productname = countproduct[x].detail[0].name.substring(0, products_name_letters) + "...";
          }
          productiteam.pricebeauty = pricebeauty;
          productiteam.sale_pricebeauty = sale_pricebeauty;
          var salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
          productiteam.alt = countproduct[x].detail[0].name;
          productiteam.productname = productname;
          if (productiteam.sale == 1) {
            productiteam.salepec = salepec;
          }
          countproduct[x] = productiteam;
        }
        resolve(countproduct);
      }
      else {
        reject('productcat null')
      }
    });
  });
}


function rendercatsbyparent(customer_id, parent_id, listcat) {
  return new Promise((resolve, reject) => {
    var listcat = '';
    ProductCat.getproductcatsbyparent(customer_id, Number(parent_id), async function (err, productcat) {
      if (productcat) {
        listcat = listcat + '<ul>';
        for (var x in productcat) {
          listcat = listcat + '<li><span><a href="/' + productcat[x].seo_url + '">' + productcat[x].detail[0].name + '</a></span>';
          if (productcat[x].list_child.length == 0 || productcat[x].list_child[0] == undefined) {
          }
          else {
            await rendercatsbyparent(customer_id, productcat[x].cat_id, listcat);
          }
          listcat = listcat + '</li>';
        }
        listcat = listcat + '</ul>';
        resolve(listcat);
      }
      else {
        reject('productcat null')
      }
    });
  });
}
router.post('/registertouse', async function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = await getwebsiteinfo(hostname);
  var customer_username = websiteinfo.customer_username
  nodeMailer = require('nodemailer');
  var newcustomers = customers({
    name: req.param('name'),
    email: req.param('email'),
    phone: req.param('phone'),
    template_name: customer_username,
    status: 0
  });
  customers.createcustomers(newcustomers, function (err, custo) {
    if (err) {

    }
    else {
      var name = req.param('name');
      var email = req.param('email');
      var phone = req.param('phone');
      var cont = 'Tên Khách hàng:' + name + '<br>-Email:' + email + '<br>-Điện thoại: ' + phone;
      let transporter = nodeMailer.createTransport({
        host: 'smtp.coresender.com',
        port: 465,
        secure: true,
        auth: {
          user: '2f7b9e54-3b07-4107-85ce-cb1a220d19a3',
          pass: 'efe90ac3-263e-4e62-95ba-1f407d446779'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      let mailOptions = {
        from: '"Khách hàng đăng ký dùng thử" <trutc@smartvas.com.vn>', // sender address
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
    }
  })
  res.send('1');
});

router.post('/gettrial', async function (req, res, next) {
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var career = req.param('career');
  var cont = 'Tên Khách hàng:' + name + '<br>-Email:' + email + '<br>-Điện thoại: ' + phone + '<br>-Lĩnh vực : ' + career;
  let transporter = nodeMailer.createTransport({
    host: 'mail.smartsign.com.vn',
    port: 25,
    secure: false,
    auth: {
      user: 'admin@smartsign.com.vn',
      pass: 'VinaCA@123'
    }
  });
  let mailOptions = {
    from: '"Thiết kế web dùng thử " <admin@smartsign.com.vn>', // sender address
    to: "congtruqn@gmail.com", // list of receivers
    subject: "Khách hàng đăng ký dùng thử", // Subject line
    text: cont, // plain text body
    html: cont, // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.send('1');
});
router.post('/addtocart', function (req, res, next) {
  var listproducts = [];
  var total_price = 0;
  if (req.session.total_price) {
    total_price = req.session.total_price;
  }
  else {

  }
  if (req.session.products) {
    listproducts = req.session.products;
  }
  var product1 = req.param('productadd');
  Productlists.getproductbyproductid(product1, function (err, product) {
    var pricebeauty = String(product.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    var productincart = {
      id: product.product_id,
      product_id: product._id,
      image: product.image,
      image_path: product.image_path,
      name: product.detail[0].name,
      price: product.price,
      product_total_price: product.price,
      product_total_price_b: pricebeauty,
      pricebeauty: pricebeauty,
      num: 1
    }
    if (listproducts.length == 0) {
      listproducts.push(productincart);
      req.session.products = listproducts;
      req.session.total_price = (Number(total_price) + Number(product.price));
      var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      req.session.total_price_pricebeauty = total_price_pricebeauty;
      res.send(req.session.products);
    }
    else {
      if (findObjectByKey(listproducts, product1) == -1) {
        listproducts.push(productincart);
        req.session.products = listproducts;
        req.session.total_price = (Number(total_price) + Number(product.price));
        var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.total_price_pricebeauty = total_price_pricebeauty;
        res.send(req.session.products);
      }
      else {
        var xx = findObjectByKey(listproducts, product1);
        listproducts[xx].num = Number(listproducts[xx].num) + 1;
        listproducts[xx].product_total_price = listproducts[xx].price * listproducts[xx].num;
        listproducts[xx].product_total_price_b = String(listproducts[xx].product_total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.products = listproducts;
        req.session.total_price = (Number(total_price) + Number(product.price) * (listproducts[xx].num - 1));
        var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.total_price_pricebeauty = total_price_pricebeauty;
        res.send(req.session.products);
      }
    }
  });
});
router.post('/updatecartnumber', function (req, res, next) {
  var product_id = req.body.id;
  console.log(product_id)
  var num = req.body.num;
  var listproducts = [];
  var total_price = 0;
  if (req.session.total_price) {
    total_price = req.session.total_price;
  }
  if (req.session.products) {
    listproducts = req.session.products;
    var xx = findObjectByKey(listproducts, product_id);
    total_price = total_price - (listproducts[xx].price * listproducts[xx].num);
    listproducts[xx].num = num;
    listproducts[xx].product_total_price = listproducts[xx].price * num;
    listproducts[xx].product_total_price_b = String(listproducts[xx].product_total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    req.session.products = listproducts;
    req.session.total_price = (Number(total_price) + Number(listproducts[xx].price) * (num));
    var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    req.session.total_price_pricebeauty = total_price_pricebeauty;
    res.send(req.session.products);
  }
})
function findObjectByKey(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id == Number(value)) {
      return i;
    }
  }
  return -1;
}
router.post('/removecartitem', function (req, res, next) {
  var array = req.session.products;
  var total_price = 0;
  if (req.session.total_price) {
    total_price = req.session.total_price;
  }
  var id = req.param('id')
  var listproducts = req.session.products;
  var xx = findObjectByKey(listproducts, id);
  total_price = total_price - (listproducts[xx].price * listproducts[xx].num);
  req.session.total_price = total_price
  var temp = removeArrayItemByAttr(array, 'id', id);
  //req.session.destroy();
  req.session.products = temp;
  res.send('ok');
});
router.get('/thankyou', async function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = await getwebsiteinfo(hostname);
  var customer_username = websiteinfo.customer_username
  res.render('content/' + customer_username + '/thankyou', {
    title: '',
    layout: websiteinfo.customer_username,
  });

});
router.get('/thong-tin-khach-hang', function (req, res, next) {
  var listcat = '';
  ProductCat.getrootproductcats(async function (err, productcatroot) {
    var newproduct = await getnewproducts(10);
    for (var x in productcatroot) {
      listcat = listcat + '<li class="product_menu_item"><span><a href="/' + productcatroot[x].seo_url + '">' + productcatroot[x].detail[0].name + '</a></span>';
      var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id, '');
      listcat = listcat + listcat1;
      listcat = listcat + '</li>';
    }
    res.render('content/customerinfo', {
      listproductmenus: listcat,
      newproducts: newproduct,
      title: '',
      layout: 'public',
    });
  });
});
function countnewsbycat(cat_id) {
  return new Promise((resolve, reject) => {
    NewsContents.countnewscontentsbycat(cat_id, function (err, count) {
      if (count) {
        resolve(count);
      }
      else {
        resolve(0);
      }
    });
  });
}
function countproductsbycat(cat_id) {
  return new Promise((resolve, reject) => {
    Productlists.countproductlistsbycat(cat_id, function (err, count) {
      if (count) {
        resolve(count);
      }
      else {
        resolve(0);
      }
    });
  });
}
function getproductcatinfo(cat_id) {
  return new Promise((resolve, reject) => {
    ProductCat.getproductcatsbycatid(cat_id, function (err, count) {
      if (count) {
        resolve(count);
      }
      else {
        reject('productcat null')
      }
    });
  });
}

router.post('/addorder', function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var address = req.param('address');
  var note = req.param('note');
  var province1 = req.param('province');
  var province = "";
  var temp1 = province1.split(";");
  if (temp1[1]) {
    province = temp1[1];
  }
  var district1 = req.param('district');
  var district = "";
  var temp2 = district1.split(";");
  if (temp2[1]) {
    district = temp2[1];
  }
  var ward1 = req.param('ward');
  var ward = "";
  var temp3 = ward1.split(";");
  if (temp3[1]) {
    ward = temp3[1];
  }
  var shippingcod = req.param('shippingcod');
  var create_date = new Date().getTime();
  var products = '';
  var neworders = new listorders({
    name: name,
    email: email,
    phone: phone,
    address: address,
    create_date: create_date,
    total_money: req.session.total_price,
    shipping_fee: shippingcod,
    province: province,
    district: district,
    ward: ward,
    customer_note: note,
    customer_id: websiteinfo.customer_id
  });
  listorders.createlistorders(neworders, function (err, producttypess) {
    for (var i in req.session.products) {
      var list_product = {
        product_id: req.session.products[i].product_id,
        product_name: req.session.products[i].name,
        product_price: req.session.products[i].price,
        product_image: req.session.products[i].image,
        product_total_price: req.session.products[i].product_total_price,
        count: req.session.products[i].num,
      }
      products = 'Tên sản phẩm :' + req.session.products[i].name + '<br>';
      products = products + 'Giá sản phẩm :' + req.session.products[i].price + '<br>';
      listorders.editlistorders(producttypess._id, { $push: { list_products: list_product } }, function (err, companys) {
        var cont = 'Tên Khách hàng:' + name + '<br>-Email:' + email + '<br>-Điện thoại: ' + phone + '<br>Địa chỉ: ' + address + '<br>';
        cont = cont + products;
        let transporter = nodeMailer.createTransport({
          host: 'smtp.coresender.com',
          port: 465,
          secure: true,
          auth: {
            user: '2f7b9e54-3b07-4107-85ce-cb1a220d19a3',
            pass: 'efe90ac3-263e-4e62-95ba-1f407d446779'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        let mailOptions = {
          from: 'trutc@smartvas.com.vn', // sender address
          to: websiteinfo.customer_email, // list of receivers
          subject: "Khách hàng đăt hàng từ website", // Subject line
          text: cont, // plain text body
          html: cont, // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
      })
    };
    req.session.destroy();
  });
  res.send('ok');
});
function getwebsiteinfo(hostname) {
  return new Promise((resolve, reject) => {
    website.getwebsitesbyurl(hostname, function (err, websi) {
      if (websi) {
        resolve(websi);
      } else {
        resolve(0);
      }
    });
  });
}
function removeArrayItemByAttr(arr, attr, value) {
  var i = arr.length;
  while (i--) {
    if (arr[i]
      && arr[i].hasOwnProperty(attr)
      && (arguments.length > 2 && arr[i][attr] == value)) {

      arr.splice(i, 1);

    }
  }
  return arr;
}
router.post('/login', function (req, res, next) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  User.getcustomeruser(req.body.username, websiteinfo.customer_id, function (err, users) {
    if (users) {
      if (users.type == 6) {
        passport.authenticate('local', function (err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login?msg=usernotfound'); }
          req.logIn(user, function (err) {
            if (err) {
              res.redirect('/login?msg=usernotfound')
            }
            else {
              res.redirect('/')
            }
          });
        })(req, res, next);
      }
      else {
        res.redirect('/login?msg=usernotfound')
      }
    }
    else {
      res.redirect('/login?msg=usernotfound')
    }
  })
})
passport.serializeUser(function (users, done) {
  done(null, users.id);
});
passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, users) {
    done(err, users);
  });
});
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, users) {
      if (err) throw err;
      if (!users) {
        return done(null, false, { message: 'Unknown User' });
      }
      User.comparePassword(password, users.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, users);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));
function getcartprovinces() {
  return new Promise((resolve, reject) => {
    province.getallprovinces(function (err, producttypess) {
      resolve(producttypess);
    })
  });
}
module.exports = router;

