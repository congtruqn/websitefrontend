const customers = require('./customers');
const systems = require('./systems');
const caches = require('./cache');
const ProductCat = require('./productcats');
const listorders = require('./listorders');
const utils = require('./utils');
const request = require('request');
var i18n = require('i18n');
var newspages = require('./newspages');
var NewsContents = require('./newscontents');
var NewsCats = require('./newscats');
var Productlists = require('./productlists');
const {countWebsitesTemplate, getAllWebsiteTemplateByPage } = require('./websites');

module.exports.renderHomePage = async function (req, res, language) {
    var hostname = req.headers.host;
    var websiteinfo = caches.websiteinfo[hostname];
    var product_per_cat_home = 0;
    if (websiteinfo && websiteinfo.products_per_cat_home) {
      product_per_cat_home = websiteinfo.products_per_cat_home;
    }
    let istemplate = false;
    if (websiteinfo && websiteinfo.is_template && websiteinfo.is_template == 1) {
      istemplate = true;
    }
    var list_products_by_more_info = caches.list_products_by_more_info[hostname];
    let listtemplates = [];
    let testimonials = [];
    let cusbanner = [];
    const promises = [];
    if (hostname == 'template1.tns.com:3005' || hostname == 'tns.vn') {
      promises.push(systems.testimonials.getTestimonialsByCustomer(3, websiteinfo.customer_id), systems.gettemplates(), systems.getbanner(websiteinfo.customer_id));
    }
    else {
      promises.push([], [], systems.getbanner(websiteinfo.customer_id));
    }
    [testimonials, listtemplates, cusbanner] = await Promise.all(promises).catch((err) => {
      console.log(err);
    });
    const hotproductcategory = caches.hotproductcategory[hostname];
    const hotandnewproducts = caches.hotandnewproducts[hostname];
    let hotnews = caches.hotnews[hostname];
    hotnews = utils.filterDetailByLang(hotnews, language);
    const website_protocol = websiteinfo.website_protocol ? websiteinfo.website_protocol : 'http';
    let homelang = '';
    let lang = 'vi';
    if (websiteinfo.website_url === hostname) {
      var { template } = websiteinfo;
      if (!caches.hotproductcats[hostname] || caches.hotproductcats[hostname] == null) {
        var hotproductcats = await gethotproductcat(websiteinfo.customer_id, product_per_cat_home, websiteinfo.products_name_letters);
        caches.hotproductcats[hostname] = hotproductcats;
      }
      var productcat = caches.hotproductcats[hostname];
      let tranData = {};
      if (websiteinfo.multi_language == 1) {
        if (language != 'vi') {
          lang = language;
          homelang = language;
        }
        tranData = websiteinfo.detail.find((obj) => obj.lang == lang);
      }
      const cacheInfo = await caches.getCaches(caches, hostname, lang);
      res.render(`${template}/content/index`, {
        productcats: productcat,
        canonical: `${website_protocol}://${hostname}/${homelang}`,
        title: tranData && tranData.title ? tranData.title : websiteinfo.title,
        description: tranData && tranData.description ? tranData.description : websiteinfo.description,
        keyword: tranData && tranData.keyword ? tranData.keyword : websiteinfo.keyword,
        banners: cusbanner,
        layout: 'layout',
        list_products_by_more_info,
        hotproductcategory,
        hotandnewproducts,
        hotnews,
        listtemplates,
        testimonials,
        language,
        lang: homelang,
        ishomepage: 1,
        istemplate,
        index: 'all',
        ...cacheInfo
      });
    }
    else {
      res.render('content/template1/error404', {
        canonical: `${hostname}/`,
        layout: 'layout'
      });
    }
};

module.exports.renderTopProducts = async function (req, res, language, type) {
    //1 Sản phẩm hot
	//2 Sản phẩm mới
	//3 Sản phẩm giảm giá
    const hostname = req.headers.host;
    const websiteinfo = caches.websiteinfo[hostname];
    const per_page = websiteinfo.products_per_page;
    const { template } = websiteinfo;
    const { customer_id } = websiteinfo;
    const cacheInfo = await caches.getCaches(caches, hostname, language);
    const page = req.param('page', '1');
    const [count, conten] =  await Promise.all([
        Productlists.countTopProducts(customer_id, type),
         Productlists.getAllTopProducts(customer_id, page, per_page, type)
    ]);
    let temlateInfo = {
        title: 'Sản phẩm bán chạy',
        description: "Sản phẩm bán chạy",
        seo_url: 'san-pham-ban-chay'
    }
    if(type==2){
        temlateInfo = {
            title: 'Sản phẩm mới',
            description: "Sản phẩm mới",
            seo_url: 'san-pham-moi'
        }
    }
    if(type==3){
        temlateInfo = {
            title: 'Sản phẩm đang khuyến mãi',
            description: "Sản phẩm đang khuyến mãii",
            seo_url: 'san-pham-khuyen-mai'
        }
    }
    const allpage = (count / per_page) + 1;
    const arraypage = [];
    for (var i = 1; i <= allpage; i++) {
        var temp = {
            pagecount: i,
            seo_url: temlateInfo.seo_url
        };
        arraypage.push(temp);
    }
     res.render(`${template}/content/hotproduct`, {
          contents: conten,
          allpage: arraypage,
          title: temlateInfo.title,
          canonical: `/${temlateInfo.seo_url}/`,
          description: temlateInfo.description,
          layout: 'layout',
          ...cacheInfo
    });
};

function gethotproductcat(customer_id, product_per_cat_home, products_name_letters) {
    return new Promise((resolve, reject) => {
      ProductCat.gethotrootproductcats(customer_id, async (err, productcat) => {
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
          reject('productcat null');
        }
      });
    });
}

function getproductbycatcout(customer_id, cat_id, product_per_cat_home, products_name_letters) {
    return new Promise((resolve, reject) => {
      Productlists.getproductbycatcount(customer_id, cat_id, product_per_cat_home, (err, countproduct) => {
        if (countproduct) {
          for (var x in countproduct) {
            var productiteam = JSON.parse(JSON.stringify(countproduct[x]));
            var pricebeauty = String(productiteam.price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            var sale_pricebeauty = String(productiteam.sale_price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            var productname = countproduct[x].detail[0].name;
            if (productname.length > products_name_letters) {
              productname = `${countproduct[x].detail[0].name.substring(0, products_name_letters)}...`;
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
          reject('productcat null');
        }
      });
    });
}