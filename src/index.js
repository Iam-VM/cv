const express = require('express');
const sequelize = require('./sequelizeConfig/config');
const sequelizeAuthenticate = require('./sequelizeConfig/sequelizeInit');
const Certs = require('./models/certs');
const Events = require('./models/events');


const app = express();

sequelizeAuthenticate(sequelize);

const PORT = process.env['PORT'] || 4000;

app.get('/:refId', (req, res) => {
    const refId = req.params.refId;
    Certs.findByPk(refId)
        .then((cert) => {
            if (cert === null) {
                res.send(`reference ID: ${refId}\nCertificate is Invalid`);
            }
            const {recipientEmail, recipientName, eventId} = cert.dataValues
            Events.findByPk(eventId)
                .then((event) => {
                    if (event === null) {
                        res.send(`reference ID: ${refId}\nDetails About this event is not added`);
                    }
                    const {eventStartDate, eventName} = event.dataValues
                    res.send(`${recipientName}\n${refId}\n${eventName}\n${recipientEmail}`);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send("There was an issue with server");
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("There was an issue with server");
        })
});

app.get('*', (req, res) => {
    res.send('404 Error');
});

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`);
});
