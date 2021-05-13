const express = require('express');
const sequelize = require('./sequelizeConfig/config');
const path = require('path');
const sequelizeAuthenticate = require('./sequelizeConfig/sequelizeInit');
const refRouter = require('./routes/ref');
const handlebars = require('express-handlebars');


const app = express();
sequelizeAuthenticate(sequelize);

// Setting up app to use the handlebars engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// config handlebars
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'index',
    partialsDir: __dirname + '/view/partials',
    extname: 'hbs',
}));

const PORT = process.env['PORT'] || 8000;

// middlewares
app.use(express.static('public'))


// routes
app.use('/ref', refRouter);


// Sending 404 for invalid routes
app.get('*', (req, res) => {
    res.send('404 Error');
});


app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`);
});
