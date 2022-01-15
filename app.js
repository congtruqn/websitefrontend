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
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
//aaaaaaaaaaa
var app = express();
var port = process.env.PORT || 3001;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
var index = require('./routes/index');
var systems = require('./models/systems');
var caches = require('./models/cache');
global.__basedir = __dirname;

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/static',express.static(path.join('D:/websites')));
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
app.use(async function(req, res, next) {
  var curent_date = new Date().getTime();
  var hostname = req.headers.host;
  //console.log(caches.websiteinfo[hostname])
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
        app.engine('handlebars', exphbs({
          partialsDir: __dirname + '/views/partials/'+websitein.customer_username
        }));
        next();
      }
      else{
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
  user:"website",
  pass:"Tru205649601@",
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true
};
var db = mongoose.connect("mongodb://localhost/website");
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
