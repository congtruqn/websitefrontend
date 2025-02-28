var express = require('express');
var compression = require('compression')
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

const rateLimit = require('express-rate-limit')
var app = express();
var port = process.env.PORT || 3005;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(compression());
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: 200, // Limit each IP to 2000 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '50mb'}));
if(process.env.NODE_ENV!='local'){
  app.use(limiter)
}
const index = require('./routes/index');
const api = require('./routes/api');
const systems = require('./models/systems'); 
const caches = require('./models/cache');
global.__basedir = __dirname;
const i18n = require('i18n');
i18n.configure({
  locales: ['en', 'vi'],
  cookie: 'locale',
  defaultLocale: 'vi',
  extension: '.json',
  directory: "" + __dirname + "/locales"
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/static',express.static(path.join(process.env.UPLOAD_DIR || 'E:/PROJECT/websites')));
app.use('/public',express.static(path.join(process.env.UPLOAD_DIR || 'E:/PROJECT/websites')));
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
  hbs.handlebars.registerHelper('formatCurrency', function (value = 0, currency = '₫') {
    if(value){
      return `${value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}${currency}` ;
    }
    else {
      return i18n.__('please_call');
    }
  });
  next();
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('truncateString', function(value,length) {
    if(value?.length>length){
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
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('filterAds', function(value,key) {
    let temp = value.filter((word) => {
      return word.position == key;
    })
    return temp;
  });
  next();
});
app.use(function(req, res, next) {
  hbs.handlebars.registerHelper('json', function(value) {
    return JSON.stringify(value);
  });
  next();
});
app.use(async function(req, res, next) {
  const hostname = req.headers.host;
  	if (hostname.match(/^www/) !== null ) {
			res.send('Website is not available now');
	  }
  let lang = 'vi'
  if(req.url.length>=3){
    const expectLang  = req.url.substring(1,3)
    switch(expectLang){
      case 'en':
        lang = 'en';
        break;
      case 'fr':
        lang = 'fr';
        break;
    }
  }
  if(!caches.websiteinfo[hostname]||caches.websiteinfo[hostname]==null){
    const websiteInfo = await systems.getWebsiteByUrl(hostname);
    if (!websiteInfo) {
      res.send('Website is not available now');
    } else {
      caches.websiteinfo[hostname] = websiteInfo;
      await caches.storeCaches(caches,hostname,websiteInfo,lang)
      app.engine('handlebars', exphbs({
            partialsDir: __dirname + `/views/${websiteInfo.template}/partials`,
            layoutsDir:__dirname +`/views/${websiteInfo.template}`,
      }));
      next();
    }
  }
  else{
    const websitein = caches.websiteinfo[hostname];
    await caches.storeCaches(caches,hostname,websitein,lang);
    app.engine('handlebars', exphbs({
      partialsDir: __dirname + `/views/${websitein.template}/partials`,
      layoutsDir:__dirname +`/views/${websitein.template}`,
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
  res.locals.base_url = process.env.FILE_URL || 'http://develop.softnests.com';
  next();
});
app.use('/api', api);
app.use('/', index);
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

if (process.env.NODE_ENV && process.env.NODE_ENV != 'production') {
  const options = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
  };
  mongoose.connect("mongodb://" + process.env.DB_URL + "/website_dev", options);
}
else {
  const options = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
  };
  mongoose.connect("mongodb://" + process.env.DB_URL + "/website", options);
}
app.use(async function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next();
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;