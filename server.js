const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();

const sess = {
    secret: process.env.DB_SECRET,
    cookie: {maxAge: 900000},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(require('./controllers'));

sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});