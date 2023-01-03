
var systems = require('./systems'); 
var websiteinfo = {}
var hotnewcats = {}
var productcat = {}
var mainmenu = {}
var footer = {}
var hotproducts = {}
var newproducts = {}
var saleproducts = {}
var hotproductcats = {}
var productmoreinfos = {}
var list_products_by_more_info = {}
var productmenu = {}
var hotproductcategory = {}
var hotnews = {}
var hotandnewproducts = {}
var provinces = ''
var policies = {}
var advertises = {}
var socialmedias = {}
var productcatcount = []
var listproductsperpage = []
var productcatinfo = []
var hotpage = {}
var partners = {}
module.exports = {
    websiteinfo,
    hotnewcats,
    productcat,
    mainmenu,
    footer,
    hotproducts,
    hotproductcats,
    newproducts,
    saleproducts,
    provinces,
    productmoreinfos,
    productmenu,
    list_products_by_more_info,
    hotproductcategory,
    hotnews,
    hotandnewproducts,
    policies,
    advertises,
    socialmedias,
    productcatcount,
    listproductsperpage,
    productcatinfo,
    hotpage,
    partners,
}
module.exports.storeCaches = async function (caches,hostname,websitein) {
    if (!caches.productcat[hostname]) {
        let productcat = await systems.gethotproductcat(websitein.customer_id);
        caches.productcat[hostname] = productcat;
    }
    if (!caches.hotproductcategory[hostname]) {
        let hotproductcategory = await systems.gethotproductcategory(websitein.customer_id);
        caches.hotproductcategory[hostname] = hotproductcategory;
    }
    if (!caches.productmenu[hostname]) {
        let productmenu = await systems.getproductmenu(websitein.customer_id);
        caches.productmenu[hostname] = productmenu;
    }
    if (!caches.mainmenu[hostname]) {
        let mainmenu = await systems.rendermainmenu(websitein.customer_id);
        caches.mainmenu[hostname] = mainmenu;
    }
    if (!caches.footer[hostname]) {
        let footer1 = await systems.getfooterbycustomer(websitein.customer_id);
        caches.footer[hostname] = footer1;
    }
    if (!caches.hotproducts[hostname]) {
        let hotproducts = await systems.gethotproductbycustomer(websitein.customer_id, 10, websitein.products_name_letters);
        caches.hotproducts[hostname] = hotproducts;
    }
    if (!caches.newproducts[hostname]) {
        let newproducts = await systems.getnewproductbycustomer(websitein.customer_id, 10, websitein.products_name_letters);
        caches.newproducts[hostname] = newproducts;
    }
    if (!caches.saleproducts[hostname]) {
        let saleproducts = await systems.getSaleProductsbyCustomer(websitein.customer_id, 10, websitein.products_name_letters);
        caches.saleproducts[hostname] = saleproducts;
    }
    if (!caches.productmoreinfos[hostname]) {
        let productmoreinfos = await systems.getallchoiseproductmoreinfos(websitein.customer_id);
        caches.productmoreinfos[hostname] = productmoreinfos;
    }
    if (!caches.list_products_by_more_info[hostname]) {
        let productmoreinfos = await systems.getproductbyproductmoreinfos(websitein.customer_id, 4);
        caches.list_products_by_more_info[hostname] = productmoreinfos;
    }
    if (!caches.hotandnewproducts[hostname]) {
        let hotandnewproducts = await systems.gethotandnewproductsbycustomer(websitein.customer_id, websitein.num_hot_products);
        caches.hotandnewproducts[hostname] = hotandnewproducts;
    }
    if (!caches.hotnews[hostname]) {
        let hotnews = await systems.gethotnewsbycustomer(websitein.customer_id, websitein.num_hot_news);
        caches.hotnews[hostname] = hotnews;
    }
    if (!caches.policies[hostname]) {
        let policies = await systems.policies.getPolicyByCustomer(websitein.customer_id);
        caches.policies[hostname] = policies;
    }
    if (!caches.advertises[hostname]) {
        let advertises = await systems.advertises.getAdvertisesByCustomer(websitein.customer_id);
        caches.advertises[hostname] = advertises;
    }
    if (!caches.socialmedias[hostname]) {
        let socialmedias = await systems.socialmedias.getSocialMediasByCustomer(websitein.customer_id);
        caches.socialmedias[hostname] = socialmedias;
    }
    if (!caches.hotpage[hostname]) {
        let hotpage = await systems.newpages.getHotPage(websitein.customer_id)
        caches.hotpage[hostname] = hotpage;
    }
    if (!caches.partners[hostname]) {
        let partners = await systems.partners.getPartnerByCustomer(websitein.customer_id)
        caches.partners[hostname] = partners;
    }
}
module.exports.getCaches = async function (caches,hostname) {
    return {
        mainmenu:caches.mainmenu[hostname],
        productmenu : caches.productcat[hostname],
        productmenu1 : caches.productmenu[hostname],
        sitefooter : caches.footer[hostname],
        newproducts : caches.newproducts[hostname],
        newproducts : caches.newproducts[hostname],
        productmoreinfos : caches.productmoreinfos[hostname],
        policies: caches.policies[hostname] ? caches.policies[hostname] : [],
        socialmedias: caches.socialmedias[hostname] ? caches.socialmedias[hostname] : [],
        siteinfo:caches.websiteinfo[hostname]? caches.websiteinfo[hostname] :{},
        hotproducts : caches.hotproducts[hostname]?caches.hotproducts[hostname]:[],
        advertises : caches.advertises[hostname]?caches.advertises[hostname]:[],
        saleproducts : caches.saleproducts[hostname]?caches.saleproducts[hostname]:[],
        hotpage:caches.hotpage[hostname]?caches.hotpage[hostname]:[],
        partners:caches.partners[hostname]?caches.partners[hostname]:[],
    }
}
module.exports.storeProductCatCaches = async function (hostname,caches,url,productcatcount,listproductsperpage,productcatinfo) {
    if(!caches.productcatinfo[hostname]){
        var countmap = new Map();
        countmap.set(url, productcatcount);
        caches.productcatcount[hostname] = countmap;
    
        var listproductmap = new Map();
        listproductmap.set(url, listproductsperpage);
        caches.listproductsperpage[hostname] = listproductmap;
    
        var pageinffo = new Map();
        pageinffo.set(url, productcatinfo);
        caches.productcatinfo[hostname] = pageinffo;
    
        return true;
    }
    else{
        if(!caches.productcatinfo[hostname].get(url)){
            caches.productcatinfo[hostname].set(url, productcatinfo);
            caches.listproductsperpage[hostname].set(url, listproductsperpage);
            caches.productcatcount[hostname].set(url, productcatcount);
            return true;
        }
        else{
            return true;
        }
    }
}

module.exports.getPartialCacheValue = async function (hostname,caches) {
    if(!caches.productcatinfo[hostname]){
        var countmap = new Map();
        countmap.set(url, productcatcount);
        caches.productcatcount[hostname] = countmap;
    
        var listproductmap = new Map();
        listproductmap.set(url, listproductsperpage);
        caches.listproductsperpage[hostname] = listproductmap;
    
        var pageinffo = new Map();
        pageinffo.set(url, productcatinfo);
        caches.productcatinfo[hostname] = pageinffo;
    
        return true;
    }
    else{
        if(!caches.productcatinfo[hostname].get(url)){
            caches.productcatinfo[hostname].set(url, productcatinfo);
            caches.listproductsperpage[hostname].set(url, listproductsperpage);
            caches.productcatcount[hostname].set(url, productcatcount);
            return true;
        }
        else{
            return true;
        }
    }

}