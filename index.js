const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');
const express = require('express');
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
const passport = require('passport');
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs');
const app = express();
require('./config/passport')(passport);

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB database......'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
// middlewars
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// app routes middlewars 
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listenning on port ${port}.......`));
