const refRouter = require("express").Router();
const Certs = require('../models/certs');
const Events = require('../models/events');

const hideRecipientEmail = (email) => {
    if (email != null) {
        const length = email.length;
        if (length > 2) {
            const starString = new Array(length - 3).join('*');
            return email.slice(0, 2) + starString + email.charAt(length - 1)
        }
        else {
            return new Array(length).join('*');
        }
    }
    return null;
};


refRouter.get('/:refId', (req, res) => {
    const refId = req.params.refId;
    console.log(refId);
    Certs.findByPk(refId)
        .then((cert) => {
            if (cert === null) {
                res.render('cv', {layout: 'index', certFound: false, refId: refId})
            }
            const {recipientEmail, recipientName, eventId} = cert.dataValues
            Events.findByPk(eventId)
                .then((event) => {
                    if (event === null) {
                        // This should never happen
                        res.render('cv', {layout: 'index', certFound: true, eventFound: false, refId: refId})
                    }
                    const hiddenEmail = hideRecipientEmail(recipientEmail);
                    const {eventStartDate, eventName} = event.dataValues
                    res.render('cv', {layout: 'index', certFound: true, eventFound: true, eventName, eventStartDate, recipientName, hiddenEmail})
                })
                .catch((err) => {
                    console.log(err);
                    res.render('serverError');
                });

        })
        .catch((err) => {
            console.log(err);
            res.render('serverError');
        })
});

module.exports = refRouter;
