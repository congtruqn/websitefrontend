var express = require('express');

var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const request = require('request');
var i18n = require('i18n');
var newspages = require('../models/newspages');
var NewsContents = require('../models/newscontents');
var NewsCats = require('../models/newscats');
var Productlists = require('../models/productlists');
const {
  getallproductbycatshow,
  countproductlistsbycat
} = require('../models/productlists');
var ProductCat = require('../models/productcats');
var listorders = require('../models/listorders');
const utils = require('../models/utils');
const {
  countWebsitesTemplate,
  getAllWebsiteTemplateByPage
} = require('../models/websites');
var customers = require('../models/customers');
var systems = require('../models/systems');
var caches = require('../models/cache');
const { storeProductCatCaches } = require('../models/cache');
var User = require('../models/register');
var province = require('../models/province');
var productmoreinfo = require('../models/productmoreinfo');
const { renderHomePage ,renderTopProducts } =  require('../models/renders');
router.get('/sitemap.xml', (req, res) => {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  res.setHeader('X-Robots-Tag', 'noindex, follow');
  res.sendFile(`${process.env.UPLOAD_DIR}/${websiteinfo.customer_username}/sitemap.xml`);
});
router.get('/website-mau', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  let hotnews = caches.hotnews[hostname];
  hotnews = utils.filterDetailByLang(hotnews, language, 1);
  const per_page = 30;
  const [count, listTemplate] = await Promise.all([countWebsitesTemplate(), getAllWebsiteTemplateByPage()]);
  var allpage = (count / per_page) + 1;
  var arraypage = [];
  for (var i = 1; i <= allpage; i++) {
    var temp = {
      pagecount: i,
      seo_url: 'website-mau'
    };
    arraypage.push(temp);
  }
  var { template } = websiteinfo;
  res.render(`${template}/content/websitetemplate`, {
    title: 'Giao diện website mẫu, template website miễn phí',
    listtemplates: listTemplate,
    siteinfo: websiteinfo,
    arraypage,
    hotnews,
    language,
    lang: homelang,
    layout: 'layout'
  });
});
router.get('/getcart', (req, res, next) => {
  if (req.session.products) {
    res.send(req.session.products.length.toString());
  }
  else {
    res.send('0');
  }
});
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.get('/templateregister', (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  const template = req.param('template', '');
  const hostname = req.headers.host;
  const productmenu = caches.productcat[hostname];
  const mainmenu = caches.mainmenu[hostname];
  const websiteinfo = caches.websiteinfo[hostname];
  const customer_username = websiteinfo.customer_username ? websiteinfo.customer_username : 'template1';
  let hotnews = caches.hotnews[hostname];
  hotnews = utils.filterDetailByLang(hotnews, language);
  res.render(`${customer_username}/content/templateregister`, {
    title: 'Register this template',
    layout: 'layout',
    productmenu,
    mainmenu,
    siteinfo: websiteinfo,
    hotnews,
    lang: homelang,
    template
  });
});
router.get('/thankyou', async (req, res, next) => {
  const hostname = req.headers.host;
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  const policies = caches.policies[hostname] ? caches.policies[hostname] : [];
  const productmenu = caches.productcat[hostname];
  const mainmenu = caches.mainmenu[hostname];
  const websiteinfo = caches.websiteinfo[hostname];
  const template = websiteinfo.template ? websiteinfo.template : 'template1';
  let hotnews = caches.hotnews[hostname];
  hotnews = utils.filterDetailByLang(hotnews, language);
  res.render(`${template}/content/thankyou`, {
    title: 'Ragister complete',
    productmenu,
    mainmenu,
    siteinfo: websiteinfo,
    hotnews,
    lang: homelang,
    policies,
    layout: 'layout'
  });
});
router.get('/login', (req, res, next) => {
  var hostname = req.headers.host;
  var productmenu = caches.productcat[hostname];
  var mainmenu = caches.mainmenu[hostname];
  const websiteinfo = caches.websiteinfo[hostname];
  const { template } = websiteinfo;
  const policies = caches.policies[hostname] ? caches.policies[hostname] : [];
  res.render(`${template}/content/login`, {
    title: 'Đăng nhập',
    layout: 'layout',
    productmenu,
    mainmenu,
    lang: homelang,
    policies,
    siteinfo: websiteinfo
  });
});
router.get('/clearcache', (req, res, next) => {
  const hostname = req.headers.host;
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
  caches.saleproducts[hostname] = null;
  caches.advertises[hostname] = null;
  caches.policies[hostname] = null;
  caches.advertises[hostname] = null;
  caches.socialmedias[hostname] = null;
  caches.productcatcount[hostname] = null;
  caches.listproductsperpage[hostname] = null;
  caches.productcatinfo[hostname] = null;
  caches.hotpage[hostname] = null;
  res.send('ok');
});
router.get('/lien-he', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const { template } = websiteinfo;
  let hotnews = caches.hotnews[hostname];
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  const content = req.param('content');
  hotnews = utils.filterDetailByLang(hotnews, language);
  res.render(`${template}/content/contact`, {
    title: 'Liên hệ',
    layout: template,
    layout: 'layout',
    hotnews,
    language,
    lang: homelang,
    content,
    ...cacheInfo
  });
});
router.get('/:lang/lien-he', async (req, res, next) => {
  const language = req.params.lang;
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const { template } = websiteinfo;
  let hotnews = caches.hotnews[hostname];
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  const content = req.param('content');
  hotnews = utils.filterDetailByLang(hotnews, language);
  res.render(`${template}/content/contact`, {
    title: 'Liên hệ',
    layout: template,
    layout: 'layout',
    hotnews,
    language,
    lang: homelang,
    content,
    ...cacheInfo
  });
});
router.get('/thankorder', async (req, res, next) => {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var websiteinfo = caches.websiteinfo[hostname];
  const { template } = websiteinfo;
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  res.render(`${template}/content/thankorder`, {
    title: '',
    layout: 'layout',
    ...cacheInfo
  });
});
router.get('/gio-hang', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  if (!caches.provinces || caches.provinces == null) {
    var province1 = await getcartprovinces();
    caches.provinces = province1;
  }
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var { template } = websiteinfo;
  var listproduct = req.session.products;
  var { provinces } = caches;
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  res.render(`${template}/content/shoppingcart`, {
    listproducts: listproduct,
    total_money: req.session.total_price,
    total_price_pricebeauty: req.session.total_price_pricebeauty,
    title: 'Giỏ hàng',
    layout: 'layout',
    provinces,
    ...cacheInfo
  });
});

router.get('/tim-kiem', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  var key = req.param('key', '');
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var { template } = websiteinfo;
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  Productlists.findproductbykey(key, websiteinfo.customer_id, (err, countproduct) => {
    for (var x in countproduct) {
      var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
      var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      var productname = countproduct[x].detail[0].name;
      if (productname.length > websiteinfo.products_name_letters) {
        productname = `${countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters)}...`;
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
    res.render(`${template}/content/search`, {
      contents: countproduct,
      title: 'Tìm kiếm sản phẩm',
      layout: 'layout',
      ...cacheInfo
    });
  });
});
router.get('/san-pham-ban-chay', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  renderTopProducts(req, res ,language , 1)
});
router.get('/san-pham-moi', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  renderTopProducts(req, res ,language , 2)
});
router.get('/san-pham-khuyen-mai', async (req, res, next) => {
  const language = i18n.getLocale();
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  renderTopProducts(req, res ,language , 3)
});
router.get('/getdistrictbyprovinces', (req, res, next) => {
  var provinceid = req.param('provinceid');
  var temp = provinceid.split(';');
  var raw = 1457;
  if (Number(temp[0]) != NaN) {
    raw = JSON.stringify({ province_id: Number(temp[0]) });
  }
  const options = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Token: '8df4cc58-7c87-11eb-9035-ae038bcc764b'
    },
    body: raw
  };
  request(options, (err, res1, body) => {
    const json = JSON.parse(body);
    var districts = '<option value="0">--Vui lòng chọn--</option>';
    var temp = json.data;
    for (var x in temp) {
      if (temp[x].DistrictID != 3442 && temp[x].DistrictID != 3450 && temp[x].DistrictID != 3448 && temp[x].DistrictID != 3449 && temp[x].DistrictID != 1580) {
        districts = `${districts}<option value="${temp[x].DistrictID};${temp[x].DistrictName}">${temp[x].DistrictName}</option>`;
      }
    }
    res.send(districts);
  });
});
router.get('/getwardbydistrict', (req, res, next) => {
  var districtid = req.param('districtid');
  var temp = districtid.split(';');
  var raw = 3286;
  if (Number(temp[0]) != NaN) {
    raw = JSON.stringify({ district_id: Number(temp[0]) });
  }
  const options = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Token: '8df4cc58-7c87-11eb-9035-ae038bcc764b'
    },
    body: raw
  };
  request(options, (err, res1, body) => {
    const json = JSON.parse(body);
    var districts = '<option value="0" select="selected">--Vui lòng chọn--</option>';
    var temp = json.data;
    for (var x in temp) {
      districts = `${districts}<option value="${temp[x].WardCode};${temp[x].WardName}">${temp[x].WardName}</option>`;
    }
    res.send(districts);
  });
});
router.get('/getshippingcod', (req, res, next) => {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var districtid1 = req.param('districtid');
  var temp = districtid1.split(';');
  var districtid = 3286;
  if (Number(temp[0]) != NaN) {
    districtid = Number(temp[0]);
  }
  var wardid1 = req.param('wardid');
  var temp1 = wardid1.split(';');
  var wardid = 471009;
  if (Number(temp1[0]) != NaN) {
    wardid = Number(temp[0]);
  }

  var temp1 = {
    shop_id: 2859838,
    from_district: 1457,
    to_district: Number(districtid)
  };

  var raw1 = JSON.stringify(temp1);
  const options1 = {
    url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: 'd1e6c9ab-fcd6-11eb-bbbe-5ae8dbedafcf'
    },
    body: raw1
  };
  request(options1, (err, res1, body) => {
    const json = JSON.parse(body);
    var serviceid = 0;
    if (body.data) {
      serviceid = json.data[0].service_id;
    }
    else {
      serviceid = 0;
    }
    var temp = {
      from_district_id: Number(websiteinfo.from_district_id),
      service_id: Number(serviceid),
      service_type_id: null,
      to_district_id: Number(districtid),
      to_ward_code: wardid,
      height: 10,
      length: 10,
      weight: 200,
      width: 10,
      insurance_value: 0,
      coupon: null
    };
    var raw = JSON.stringify(temp);
    const options = {
      url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: 'd1e6c9ab-fcd6-11eb-bbbe-5ae8dbedafcf',
        ShopId: 2859838
      },
      body: raw
    };
    request(options, (err, res1, body) => {
      const json = JSON.parse(body);
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
const renderpage = async function (req, res, website_url, language = 'vi') {
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  let istemplate = false;
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  var { customer_id } = websiteinfo;
  var { template } = websiteinfo;
  let hotnews = caches.hotnews[hostname];
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  newspages.getNewsPagesById(customer_id, website_url.content_id, (err, conten) => {
    let tranData = null;
    let canonical = conten.seo_url;
    if (websiteinfo.multi_language == 1) {
      if (language != 'vi') {
        lang = language;
        homelang = language;
      }
      canonical = `${language}/${canonical}`;
      tranData = conten.detail.find((obj) => obj.lang == language);
      hotnews = utils.filterDetailByLang(hotnews, language, 1);
    }
    res.render(`${template}/content/page`, {
      contents: conten,
      details: tranData || conten.detail[0],
      title: tranData && tranData.title ? tranData.title : conten.detail[0].title,
      description: tranData && tranData.description ? tranData.description : conten.detail[0].description,
      keyword: tranData && tranData.keyword ? tranData.keyword : conten.detail[0].keyword,
      canonical: `${website_protocol}://${hostname}/${canonical}`,
      layout: 'layout',
      language,
      lang: homelang,
      hotnews,
      istemplate,
      index: 'all',
      ...cacheInfo
    });
  });
};
const render404page = async function (req, res, website_url, language = 'vi') {
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  let istemplate = false;
  const hostname = req.headers.host;
  const cacheInfo = await caches.getCaches(caches, hostname, language);
  const websiteinfo = caches.websiteinfo[hostname];
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  const { template } = websiteinfo;
  if (websiteinfo.multi_language == 1) {
    if (language != 'vi') {
      lang = language;
      homelang = language;
    }
  }
  res.render(`${template}/content/error404`, {
    title: 'Error 404',
    description: '',
    keyword: '',
    canonical: '/',
    layout: 'layout',
    language,
    lang: homelang,
    index: 'noindex',
    istemplate,
    ...cacheInfo
  });
};
const rendernewcontentpage = async function (req, res, website_url, language = 'vi') {
  const hostname = req.headers.host;
  const cacheInfo = await caches.getCaches(caches, hostname);
  const websiteinfo = caches.websiteinfo[hostname];
  let homelang = language;
  if (language == 'vi') {
    homelang = '';
  }
  let istemplate = false;
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  const { template } = websiteinfo;
  var { customer_id } = websiteinfo;
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  let hotnews = caches.hotnews[hostname];
  const newsInfo = await NewsContents.getNewsInfo(customer_id, website_url.content_id);
  let listRateNews = await NewsContents.getRateNews( newsInfo.parent_id, newsInfo.content_id, 8, customer_id );

  let tranData = null;
  let canonical = newsInfo.seo_url;
  if (websiteinfo.multi_language == 1) {
      if (language != 'vi') {
          canonical = `${language}/${canonical}`;
      }
      tranData = newsInfo.detail.find((obj) => obj.lang == language);
      listRateNews = utils.filterDetailByLang(listRateNews, language, 1);
      hotnews = utils.filterDetailByLang(hotnews, language, 1);
  }

  res.render(`${template}/content/newscontent`, {
      contents: newsInfo,
      hotnews,
      ratenews: listRateNews,
      details: tranData || newsInfo.detail[0],
      title: tranData && tranData.title ? tranData.title : newsInfo.detail[0].title,
      description: tranData && tranData.description ? tranData.description : newsInfo.detail[0].description,
      keyword: tranData && tranData.keyword ? tranData.keyword : newsInfo.detail[0].keyword,
      canonical: `${website_protocol}://${hostname}/${canonical}`,
      orgimage: `${website_protocol}://${hostname}/static/${template}/images/news/fullsize/${newsInfo.image2}`,
      layout: 'layout',
      language,
      lang: homelang,
      istemplate,
      index: 'all',
      ...cacheInfo
  });
};
const rendernewcatpage = async function (req, res, website_url, language = 'vi') {
  let homelang = language;
  var hostname = req.headers.host;
  const cacheInfo = await caches.getCaches(caches, hostname);
  const websiteinfo = caches.websiteinfo[hostname];
  if (language == 'vi') {
    homelang = '';
  }
  let istemplate = false;
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  var { customer_id } = websiteinfo;
  var { template } = websiteinfo;
  var per_page = 18;
  var page = req.param('page', '1');
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  const hotnews = caches.hotnews[hostname];
  const hotnews1 = utils.filterDetailByLang(hotnews, language, 1);
  NewsCats.getnewscatsbycatid(customer_id, website_url.content_id, async (err, newcatinfo) => {
    let newsCatData = null;
    if (websiteinfo.multi_language == 1) {
      newsCatData = newcatinfo.detail.find((obj) => obj.lang == language);
    }
    let [count, conten] = await Promise.all([
      NewsContents.countNewsByCat(newcatinfo.cat_id, customer_id),
      NewsContents.getnewsnontentsbycatcount(website_url.content_id, page, per_page, customer_id)
    ]);
    var allpage = (count / per_page) + 1;
    var arraypage = [];
    for (var i = 1; i <= allpage; i++) {
      var temp = {
        pagecount: i,
        seo_url: newcatinfo.seo_url
      };
      arraypage.push(temp);
    }
    if (language == 'vi') {
      conten = utils.filterDetailByLang(conten, language, 0);
    }
    else {
      conten = utils.filterDetailByLang(conten, language, 1);
    }
    res.render(`${template}/content/newscat`, {
      contents: conten,
      hotnews: hotnews1,
      allpage: arraypage,
      newscatinfo: newcatinfo,
      newcatdetail: newsCatData || newcatinfo.detail[0],
      title: newsCatData ? newsCatData.title : newcatinfo.detail[0].title,
      description: newsCatData ? newsCatData.description : newcatinfo.detail[0].description,
      keyword: newsCatData ? newsCatData.keyword : newcatinfo.detail[0].keyword,
      canonical: language ? `${website_protocol}://${hostname}/${language}/${newcatinfo.seo_url}/` : `${website_protocol}://${hostname}/${newcatinfo.seo_url}/`,
      orgimage: `${website_protocol}://${hostname}/images/news/fullsize/${conten.image}`,
      language,
      lang: homelang,
      layout: 'layout',
      istemplate,
      index: 'all',
      ...cacheInfo
    });
  });
};
const renderproductcatpage = async function (req, res, website_url) {
  const hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  const cacheInfo = await caches.getCaches(caches, hostname);
  const { customer_id } = websiteinfo;
  var { template } = websiteinfo;
  var per_page = websiteinfo.products_per_page ? websiteinfo.products_per_page : 24;
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  const pageurl = req.headers.host + req.url;
  var page = req.param('page', '1');
  if (!caches.productcatinfo[hostname] || !caches.productcatinfo[hostname].get(pageurl)) {
    const [count, catinfo, listproductsperpage] = await Promise.all([
      countproductlistsbycat(customer_id, website_url.content_id),
      ProductCat.getProductCatByCatId(customer_id, website_url.content_id),
      getallproductbycatshow(customer_id, website_url.content_id, page, per_page)
    ]);
    await storeProductCatCaches(hostname, caches, pageurl, count, listproductsperpage, catinfo);
  }
  const count = caches.productcatcount[hostname].get(pageurl);
  const catinfo = caches.productcatinfo[hostname].get(pageurl);
  const countproduct = caches.listproductsperpage[hostname].get(pageurl);
  let language = i18n.getLocale();
  if (language == 'vi') {
    language = '';
  }
  let istemplate = false;
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  for (var x in countproduct) {
    var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
    var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    var productname = countproduct[x].detail[0].name;
    if (productname.length > websiteinfo.products_name_letters) {
      productname = `${countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters)}...`;
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
    };
    arraypage.push(temp);
  }
  res.render(`${template}/content/productscat`, {
    contents: countproduct,
    allpage: arraypage,
    newscatinfo: countproduct,
    productcatinfo: catinfo.detail[0],
    title: catinfo.detail[0].title,
    canonical: `${website_protocol}://${hostname}/${catinfo.seo_url}/`,
    description: catinfo.detail[0].description,
    keyword: catinfo.detail[0].keyword,
    catinfo,
    layout: 'layout',
    language,
    istemplate,
    index: 'all',
    ...cacheInfo
  });
};
const renderproductdetailpage = async function (req, res, website_url) {
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const cacheInfo = await caches.getCaches(caches, hostname);
  const { customer_id } = websiteinfo;
  const { template } = websiteinfo;
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  let language = i18n.getLocale();
  if (language == 'vi') {
    language = '';
  }
  let istemplate = false;
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  const productInfo = await Productlists.getProductById(customer_id, website_url.content_id);

  Productlists.getrateproductlistscatcount(customer_id, productInfo.parent_id, productInfo.product_id, websiteinfo.num_of_rate_product || 8 , (err, rateproducts) => {
      for (var x in rateproducts) {
        var productiteam = JSON.parse(JSON.stringify(rateproducts[x]));
        var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        productiteam.pricebeauty = pricebeauty;
        productiteam.alt = rateproducts[x].detail[0].name;
        const salepec = parseInt(((productiteam.sale_price - productiteam.price) / productiteam.sale_price) * 100);
        if (productiteam.sale == 1) {
          productiteam.salepec = salepec;
        }
        if (productiteam.hot == 0) {
          productiteam.hot = undefined;
        }
        if (productiteam.new == 0) {
          productiteam.new = undefined;
        }
        rateproducts[x] = productiteam;
      }
      var procontent = JSON.parse(JSON.stringify(productInfo.detail[0]));
      var product_details = productInfo.product_detail;
      var { product_more_info } = productInfo;
      for (var x in product_more_info) {
        if (product_more_info[x].status == 1) {
          product_more_info[x].status = undefined;
        }
        if (product_more_info[x].status == 1) {
          product_more_info[x].status = undefined;
        }
      }
      var pricebeauty = String(productInfo.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      let islogin = null;
      var instock = undefined;
      if (req.user) {
        islogin = 1;
      }
      if (productInfo.show == 1) {
        instock = 1;
      }
      res.render(`${template}/content/productdetail`, {
        description: productInfo.detail[0].description,
        canonical: `${website_protocol}://${hostname}/${productInfo.seo_url}`,
        orgimage: `${website_protocol}://${hostname}/images/products/fullsize/${productInfo.image2}`,
        contents: productInfo,
        product_details,
        price: pricebeauty,
        details: procontent,
        title: productInfo.detail[0].title,
        layout: 'layout',
        instock,
        product_more_info,
        islogin,
        rateproducts,
        language,
        istemplate,
        index: 'all',
        ...cacheInfo
    });
  });
};
const renderproductmoreinfocategorypage = async function (req, res, website_url) {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  var { customer_id } = websiteinfo;
  var { template } = websiteinfo;
  var mainmenu = caches.mainmenu[hostname];
  var productmenu = caches.productcat[hostname];
  var productmenu1 = caches.productmenu[hostname];
  var sitefooter = caches.footer[hostname];
  var newproducts = caches.newproducts[hostname];
  var productmoreinfos = caches.productmoreinfos[hostname];
  const policies = caches.policies[hostname] ? caches.policies[hostname] : [];
  var per_page = websiteinfo.products_per_page;
  var page = req.param('page', '1');
  const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
  let language = i18n.getLocale();
  if (language == 'vi') {
    language = '';
  }
  let istemplate = false;
  if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
    istemplate = true;
  }
  Productlists.countproductbymoreinfo(customer_id, website_url.content_id, async (err, count) => {
    productmoreinfo.getmoreinfovalue(customer_id, website_url.content_id, (err, productmorein) => {
      Productlists.getallproductbymoreinfo(customer_id, website_url.content_id, Number(page), per_page, async (err, countproduct) => {
        for (var x in countproduct) {
          var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
          var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
          var productname = countproduct[x].detail[0].name;
          if (productname.length > websiteinfo.products_name_letters) {
            productname = `${countproduct[x].detail[0].name.substring(0, websiteinfo.products_name_letters)}...`;
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
          };
          arraypage.push(temp);
        }
        res.render(`${template}/content/productmoreinfo`, {
          contents: countproduct,
          allpage: arraypage,
          newscatinfo: countproduct,
          productcatinfo: productmorein[0].default_value[0],
          title: productmorein[0].default_value[0].title,
          canonical: `${website_protocol}://${hostname}/${productmorein[0].default_value[0].seo_url}/`,
          description: productmorein[0].default_value[0].description,
          keyword: productmorein[0].default_value[0].keyword,
          layout: 'layout',
          productmenu,
          productmenu1,
          mainmenu,
          siteinfo: websiteinfo,
          sitefooter,
          newproducts,
          language,
          productmoreinfos,
          policies,
          socialmedias: caches.socialmedias[hostname] ? caches.socialmedias[hostname] : [],
          istemplate,
          index: 'all'
        });
      });
    });
  });
};
router.get('/', async (req, res) => {
  res.cookie('locale', 'vi');
  i18n.setLocale('vi');
  renderHomePage(req, res, 'vi');
});
router.get('/:seourl', async (req, res, next) => {
  const { seourl } = req.params;
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const { customer_id } = websiteinfo;
  const { customer_username } = websiteinfo;
  switch (seourl) {
    case 'en':
      res.cookie('locale', 'en');
      i18n.setLocale('en');
      renderHomePage(req, res, i18n.getLocale());
      break;
    case 'vi':
      res.cookie('locale', 'vi');
      i18n.setLocale('vi');
      res.redirect('/');
      break;
    default:
      const website_url = await systems.getwebsitebyseourl(customer_id, seourl);
      if (!website_url) {
        if (customer_username) {
          render404page(req, res, website_url);
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
router.get('/:seourl1/:selurl2', async (req, res, next) => {
  const { seourl1 } = req.params;
  const seourl2 = req.params.selurl2;
  let seourl = `${seourl1}/${seourl2}`;
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const { customer_id } = websiteinfo;
  const { customer_username } = websiteinfo;
  let lang = 'vi';
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
  else {
    res.cookie('locale', 'vi');
    i18n.setLocale('vi');
  }
  const website_url = await systems.getwebsitebyseourl(customer_id, seourl);
  if (!website_url) {
    if (customer_username) {
      render404page(req, res, website_url, lang);
    }
  }
  else {
    switch (website_url.type) {
      case 1:
        renderpage(req, res, website_url, lang);
        break;
      case 2:
        rendernewcatpage(req, res, website_url, lang);
        break;
      case 3:
        rendernewcontentpage(req, res, website_url, lang);
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

function rendercatsbyparent(customer_id, parent_id, listcat) {
  return new Promise((resolve, reject) => {
    var listcat = '';
    ProductCat.getproductcatsbyparent(customer_id, Number(parent_id), async (err, productcat) => {
      if (productcat) {
        listcat += '<ul>';
        for (var x in productcat) {
          listcat = `${listcat}<li><span><a href="/${productcat[x].seo_url}">${productcat[x].detail[0].name}</a></span>`;
          if (productcat[x].list_child.length == 0 || productcat[x].list_child[0] == undefined) {
          }
          else {
            await rendercatsbyparent(customer_id, productcat[x].cat_id, listcat);
          }
          listcat += '</li>';
        }
        listcat += '</ul>';
        resolve(listcat);
      }
      else {
        reject('productcat null');
      }
    });
  });
}
router.post('/registertouse', async (req, res, next) => {
  nodeMailer = require('nodemailer');
  var newcustomers = customers({
    name: req.param('name') ? req.param('name') : '',
    email: req.param('email') ? req.param('email') : '',
    phone: req.param('phone') ? req.param('phone') : '',
    template_name: req.param('template') ? req.param('template') : '',
    status: 0
  });
  customers.createcustomers(newcustomers, (err, custo) => {
    if (err) {

    }
    else {
      var name = req.param('name');
      var email = req.param('email');
      var phone = req.param('phone');
      var cont = `Tên Khách hàng:${name}<br>-Email:${email}<br>-Điện thoại: ${phone}`;
      const transporter = nodeMailer.createTransport({
        host: 'smtp.elasticemail.com',
        port: 2525,
        secure: false,
        auth: {
          user: 'congtruqn@gmail.com',
          pass: '708541B0547DF83A89CC6CDA4CCBF27D147B'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      const mailOptions = {
        from: '"Khách hàng đăng ký dùng thử" <congtruqn@gmail.com>', // sender address
        to: 'congtruqn@gmail.com', // list of receivers
        subject: 'Khách hàng đăng ký', // Subject line
        text: cont, // plain text body
        html: cont // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
      });
    }
  });
  res.send('1');
});

router.post('/gettrial', async (req, res, next) => {
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var career = req.param('career');
  var cont = `Tên Khách hàng:${name}<br>-Email:${email}<br>-Điện thoại: ${phone}<br>-Lĩnh vực : ${career}`;
  const transporter = nodeMailer.createTransport({
    host: 'mail.smartsign.com.vn',
    port: 25,
    secure: false,
    auth: {
      user: 'admin@smartsign.com.vn',
      pass: 'VinaCA@123'
    }
  });
  const mailOptions = {
    from: '"Thiết kế web dùng thử " <admin@smartsign.com.vn>', // sender address
    to: 'congtruqn@gmail.com', // list of receivers
    subject: 'Khách hàng đăng ký dùng thử', // Subject line
    text: cont, // plain text body
    html: cont // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.send('1');
});
router.post('/addtocart',async (req, res, next) => {
  try {
    const hostname = req.headers.host;
    const websiteinfo = caches.websiteinfo[hostname];
    const { customer_id } = websiteinfo;
    let listproducts = [];
    let total_price = 0;
    if (req.session.total_price) {
      total_price = req.session.total_price;
    }
    else {
  
    }
    if (req.session.products) {
      listproducts = req.session.products;
    }
    const product_id = req.param('productadd');
  
    const productInfo = await Productlists.getProductById(customer_id, product_id);
    const pricebeauty = String(productInfo.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    var productincart = {
        id: productInfo.product_id,
        product_id: productInfo._id,
        image: productInfo.image,
        image_path: productInfo.image_path,
        name: productInfo.detail[0].name,
        price: productInfo.price,
        product_total_price: productInfo.price,
        product_total_price_b: pricebeauty,
        pricebeauty,
        num: 1
    };
    if (listproducts.length == 0) {
        listproducts.push(productincart);
        req.session.products = listproducts;
        req.session.total_price = (Number(total_price) + Number(productInfo.price));
        var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.total_price_pricebeauty = total_price_pricebeauty;
        res.send(req.session.products);
    }
    else if (findObjectByKey(listproducts, product_id) == -1) {
        listproducts.push(productincart);
        req.session.products = listproducts;
        req.session.total_price = (Number(total_price) + Number(productInfo.price));
        var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.total_price_pricebeauty = total_price_pricebeauty;
        res.send(req.session.products);
    }
    else {
        var xx = findObjectByKey(listproducts, product_id);
        listproducts[xx].num = Number(listproducts[xx].num) + 1;
        listproducts[xx].product_total_price = listproducts[xx].price * listproducts[xx].num;
        listproducts[xx].product_total_price_b = String(listproducts[xx].product_total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.products = listproducts;
        req.session.total_price = (Number(total_price) + Number(productInfo.price) * (listproducts[xx].num - 1));
        var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        req.session.total_price_pricebeauty = total_price_pricebeauty;
        res.send(req.session.products);
    }
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_ADD_PRODUCT_TO_CART'})
  }
});
router.post('/updatecartnumber', (req, res, next) => {
  var product_id = req.body.id;
  var { num } = req.body;
  var listproducts = [];
  var total_price = 0;
  if (req.session.total_price) {
    total_price = req.session.total_price;
  }
  if (req.session.products) {
    listproducts = req.session.products;
    var xx = findObjectByKey(listproducts, product_id);
    total_price -= (listproducts[xx].price * listproducts[xx].num);
    listproducts[xx].num = num;
    listproducts[xx].product_total_price = listproducts[xx].price * num;
    listproducts[xx].product_total_price_b = String(listproducts[xx].product_total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    req.session.products = listproducts;
    req.session.total_price = (Number(total_price) + Number(listproducts[xx].price) * (num));
    var total_price_pricebeauty = String(req.session.total_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    req.session.total_price_pricebeauty = total_price_pricebeauty;
    res.send(req.session.products);
  }
});
function findObjectByKey(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id == Number(value)) {
      return i;
    }
  }
  return -1;
}
router.post('/removecartitem', (req, res, next) => {
  try {
    const array = req.session.products;
    let total_price = 0;
    if (req.session.total_price) {
      total_price = req.session.total_price;
    }
    const id = req.params('id');
    const listproducts = req.session.products;
    const xx = findObjectByKey(listproducts, id);
    total_price -= (listproducts[xx].price * listproducts[xx].num);
    req.session.total_price = total_price;
    const temp = removeArrayItemByAttr(array, 'id', id);
    req.session.products = temp;
    res.json({status: "SUCCESS"});
  } catch (error) {
    console.log(error);
    res.json({statusCode: 500, message:'CANNOT_ADD_PRODUCT_TO_CART'})
  }
});
router.get('/thong-tin-khach-hang', (req, res, next) => {
  var listcat = '';
  ProductCat.getrootproductcats(async (err, productcatroot) => {
    var newproduct = await getnewproducts(10);
    for (var x in productcatroot) {
      listcat = `${listcat}<li class="product_menu_item"><span><a href="/${productcatroot[x].seo_url}">${productcatroot[x].detail[0].name}</a></span>`;
      var listcat1 = await rendercatsbyparent(productcatroot[x].cat_id, '');
      listcat += listcat1;
      listcat += '</li>';
    }
    res.render('content/customerinfo', {
      listproductmenus: listcat,
      newproducts: newproduct,
      title: '',
      layout: 'public'
    });
  });
});

router.post('/addcustomercontact', (req, res, next) => {
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  const nodeMailer = require('nodemailer');
  const name = req.params('name');
  const email = req.params('email');
  const phone = req.params('phone');
  const content = req.params('content');
  var cont = `Tên Khách hàng:${name}<br>Email:${email}<br>Điện thoại: ${phone}<br>Nội dung: ${content}<br>`;
  const transporter = nodeMailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'congtruqn@gmail.com',
      pass: '708541B0547DF83A89CC6CDA4CCBF27D147B'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const mailOptions = {
    from: 'congtruqn@gmail.com', // sender address
    to: websiteinfo.customer_email, // list of receivers
    subject: 'Khách hàng đăt hàng từ website', // Subject line
    text: cont, // plain text body
    html: cont // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.send('ok');
});
router.post('/addorder', (req, res, next) => {
  const hostname = req.headers.host;
  const websiteinfo = caches.websiteinfo[hostname];
  nodeMailer = require('nodemailer');
  const name = req.params('name');
  const email = req.params('email');
  const phone = req.params('phone');
  const address = req.params('address');
  const note = req.params('note');
  const province1 = req.params('province');
  let province = '';
  const temp1 = province1.split(';');
  if (temp1[1]) {
    province = temp1[1];
  }
  const district1 = req.params('district');
  let district = '';
  const temp2 = district1.split(';');
  if (temp2[1]) {
    district = temp2[1];
  }
  const ward1 = req.params('ward');
  let ward = '';
  const temp3 = ward1.split(';');
  if (temp3[1]) {
    ward = temp3[1];
  }
  const shippingcod = req.params('shippingcod');
  const create_date = new Date().getTime();
  let products = '';
  const neworders = new listorders({
    name,
    email,
    phone,
    address,
    create_date,
    total_money: req.session.total_price,
    shipping_fee: shippingcod,
    province,
    district,
    ward,
    customer_note: note,
    customer_id: websiteinfo.customer_id
  });
  listorders.createlistorders(neworders, (err, producttypess) => {
    for (var i in req.session.products) {
      var list_product = {
        product_id: req.session.products[i].product_id,
        product_name: req.session.products[i].name,
        product_price: req.session.products[i].price,
        product_image: req.session.products[i].image,
        product_total_price: req.session.products[i].product_total_price,
        count: req.session.products[i].num
      };
      products = `Tên sản phẩm :${req.session.products[i].name}<br>`;
      products = `${products}Giá sản phẩm :${req.session.products[i].price}<br>`;
      listorders.editlistorders(producttypess._id, { $push: { list_products: list_product } }, (err, companys) => {
        var cont = `Tên Khách hàng:${name}<br>-Email:${email}<br>-Điện thoại: ${phone}<br>Địa chỉ: ${address}<br>`;
        cont += products;
        const transporter = nodeMailer.createTransport({
          host: 'smtp.elasticemail.com',
          port: 2525,
          secure: false,
          auth: {
            user: 'congtruqn@gmail.com',
            pass: '708541B0547DF83A89CC6CDA4CCBF27D147B'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        const mailOptions = {
          from: 'congtruqn@gmail.com', // sender address
          to: websiteinfo.customer_email, // list of receivers
          subject: 'Khách hàng đăt hàng từ website', // Subject line
          text: cont, // plain text body
          html: cont // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });
      });
    }
    req.session.destroy();
  });
  res.send('ok');
});
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
router.post('/login', (req, res, next) => {
  var hostname = req.headers.host;
  var websiteinfo = caches.websiteinfo[hostname];
  User.getcustomeruser(req.body.username, websiteinfo.customer_id, (err, users) => {
    if (users) {
      if (users.type == 6) {
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.redirect('/login?msg=usernotfound');
          }
          req.logIn(user, (err) => {
            if (err) {
              res.redirect('/login?msg=usernotfound');
            }
            else {
              res.redirect('/');
            }
          });
        })(req, res, next);
      }
      else {
        res.redirect('/login?msg=usernotfound');
      }
    }
    else {
      res.redirect('/login?msg=usernotfound');
    }
  });
});
passport.serializeUser((users, done) => {
  done(null, users.id);
});
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, users) => {
    done(err, users);
  });
});
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, users) => {
      if (err) throw err;
      if (!users) {
        return done(null, false, { message: 'Unknown User' });
      }
      User.comparePassword(password, users.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, users);
        }

        return done(null, false, { message: 'Invalid password' });
      });
    });
  }
));
function getcartprovinces() {
  return new Promise((resolve, reject) => {
    province.getallprovinces((err, producttypess) => {
      resolve(producttypess);
    });
  });
}
module.exports = router;
