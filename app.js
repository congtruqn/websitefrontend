var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3005;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
var index = require('./routes/index');
var systems = require('./models/systems');
var caches = require('./models/cache');
global.__basedir = __dirname;
var i18n = require('i18n');
i18n.configure({
  locales: ['en', 'vi'],
  cookie: 'locale',
  defaultLocale: 'vi',
  extension: '.json',
  directory: "" + __dirname + "/locales"
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
}));
app.set('view engine', 'handlebars');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/static',express.static(path.join(process.env.UPLOAD_DIR)));
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
var hbs = exphbs.create({
  extname: '.hbs'
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('formatCurrency', function(value) {
    if(value){
      return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    else{
      return 'Please call'
    }
  });
  next();
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('truncateString', function(value,length) {
    if(value.length>length){
      return value.substring(0,length) + '...';
    }
    return value;
  });
  next();
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('i18n', function(value) {
      return i18n.__(value);
  });
  next();
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('timestampToString', function(value) {
    let date = new Date(value);
    return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
  });
  next();
});
app.use(async function(req, res, next) {
  var curent_date = new Date().getTime();
  var hostname = req.headers.host;
  if(!caches.websiteinfo[hostname]||caches.websiteinfo[hostname]==null){
    systems.getwebsiteinfo(hostname,async function(err, websitein){
      if(websitein===null){
        res.redirect(301, 'http://tns.vn');
      }
      if(websitein){
        caches.websiteinfo[hostname] = websitein;
        caches.websiteinfo[hostname].date = curent_date+(1000*60*1);
        if(!caches.productcat[hostname]||caches.productcat[hostname]==null){
          var productcat = await systems.gethotproductcat(websitein.customer_id);
          caches.productcat[hostname] = productcat;
        }
        if(!caches.hotproductcategory[hostname]||caches.hotproductcategory[hostname]==null){
          var hotproductcategory = await systems.gethotproductcategory(websitein.customer_id);
          caches.hotproductcategory[hostname] = hotproductcategory;
        }
        if(!caches.productmenu[hostname]||caches.productmenu[hostname]==null){
          var productmenu = await systems.getproductmenu(websitein.customer_id);
          caches.productmenu[hostname] = productmenu;
        }
        if(!caches.mainmenu[hostname]||caches.mainmenu[hostname]==null){
          var mainmenu = await systems.rendermainmenu(websitein.customer_id);
          caches.mainmenu[hostname] = mainmenu;
        }
        if(!caches.footer[hostname]||caches.footer[hostname]==null){
          var footer1 = await systems.getfooterbycustomer(websitein.customer_id);
          caches.footer[hostname] = footer1;
        }
        if(!caches.hotproducts[hostname]||!caches.hotproducts[hostname]==null){
          var hotproducts = await systems.gethotproductbycustomer(websitein.customer_id,10,websitein.products_name_letters);
          caches.hotproducts[hostname] = hotproducts;
        }
        if(!caches.newproducts[hostname]||caches.newproducts[hostname]==null){
          var newproducts = await systems.getnewproductbycustomer(websitein.customer_id,10,websitein.products_name_letters);
          caches.newproducts[hostname] = newproducts;
        }
        if(!caches.productmoreinfos[hostname]||caches.productmoreinfos[hostname]==null){
          var productmoreinfos = await systems.getallchoiseproductmoreinfos(websitein.customer_id);
          caches.productmoreinfos[hostname] = productmoreinfos;
        }
        if(!caches.list_products_by_more_info[hostname]||caches.list_products_by_more_info[hostname]==null){
          let productmoreinfos = await systems.getproductbyproductmoreinfos(websitein.customer_id,4);
          caches.list_products_by_more_info[hostname] = productmoreinfos;
        }
        if(!caches.hotandnewproducts[hostname]||caches.hotandnewproducts[hostname]==null){
          let hotandnewproducts = await systems.gethotandnewproductsbycustomer(websitein.customer_id,websitein.num_hot_products);
          caches.hotandnewproducts[hostname] = hotandnewproducts;
        }
        if(!caches.hotnews[hostname]||caches.hotnews[hostname]==null){
          let hotnews = await systems.gethotnewsbycustomer(websitein.customer_id,websitein.num_hot_news);
          caches.hotnews[hostname] = hotnews;
        }
        if(!caches.policies[hostname]||caches.policies[hostname]==null){
          let policies = await systems.policies.getPolicyByCustomer(websitein.customer_id);
          caches.policies[hostname] = policies;
        }
        app.engine('handlebars', exphbs({
          partialsDir: __dirname + '/views/partials/'+websitein.customer_username
        }));
        next();
      }
    });
  }
  else{
    var websitein = caches.websiteinfo[hostname];
    if(!caches.productcat[hostname]||caches.productcat[hostname]==null){
      var productcat = await systems.gethotproductcat(websitein.customer_id);
      caches.productcat[hostname] = productcat;
    }
    if(!caches.hotproductcategory[hostname]||caches.hotproductcategory[hostname]==null){
      var hotproductcategory = await systems.gethotproductcategory(websitein.customer_id);
      caches.hotproductcategory[hostname] = hotproductcategory;
    }
    if(!caches.productmenu[hostname]||caches.productmenu[hostname]==null){
      var productmenu = await systems.getproductmenu(websitein.customer_id);
      caches.productmenu[hostname] = productmenu;
    }
    if(!caches.mainmenu[hostname]||caches.mainmenu[hostname]==null){
      var mainmenu = await systems.rendermainmenu(websitein.customer_id);
      caches.mainmenu[hostname] = mainmenu;
    }
    if(!caches.footer[hostname]||caches.footer[hostname]==null){
        var footer1 = await systems.getfooterbycustomer(websitein.customer_id);
        caches.footer[hostname] = footer1;
    }
    if(!caches.hotproducts[hostname]||!caches.hotproducts[hostname]==null){
      var hotproducts = await systems.gethotproductbycustomer(websitein.customer_id,10,websitein.products_name_letters);
      caches.hotproducts[hostname] = hotproducts;
    }
    if(!caches.newproducts[hostname]||caches.newproducts[hostname]==null){
      var newproducts = await systems.getnewproductbycustomer(websitein.customer_id,10,websitein.products_name_letters);
      caches.newproducts[hostname] = newproducts;
    }
    if(!caches.productmoreinfos[hostname]||caches.productmoreinfos[hostname]==null){
      var productmoreinfos = await systems.getallchoiseproductmoreinfos(websitein.customer_id);
      caches.productmoreinfos[hostname] = productmoreinfos;
    }
    if(!caches.list_products_by_more_info[hostname]||caches.list_products_by_more_info[hostname]==null){
      let productmoreinfos = await systems.getproductbyproductmoreinfos(websitein.customer_id,4);
      caches.list_products_by_more_info[hostname] = productmoreinfos;
    }
    if(!caches.hotandnewproducts[hostname]||caches.hotandnewproducts[hostname]==null){
      let hotandnewproducts = await systems.gethotandnewproductsbycustomer(websitein.customer_id,websitein.num_hot_products);
      caches.hotandnewproducts[hostname] = hotandnewproducts;
    }
    if(!caches.hotnews[hostname]||caches.hotnews[hostname]==null){
      let hotnews = await systems.gethotnewsbycustomer(websitein.customer_id,websitein.num_hot_news);
      caches.hotnews[hostname] = hotnews;
    }
    if(!caches.policies[hostname]||caches.policies[hostname]==null){
      let policies = await systems.policies.getPolicyByCustomer(websitein.customer_id);
      caches.policies[hostname] = policies;
    }
    app.engine('handlebars', exphbs({
       partialsDir: __dirname + '/views/partials/'+websitein.customer_username  
    }));
    next();
  }
});
app.use(require('request-param')({ order: ["body","params","query"] } ) );
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
app.use('/', index);
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const options = {
  user:process.env.MONGO_USER,
  pass:process.env.MONGO_PASSWORD,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true
};
var db = mongoose.connect("mongodb://"+process.env.DB_URL+"/website",options);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next();
});// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
