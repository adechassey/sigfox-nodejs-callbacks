const Message = require('../models/message'),
    contactsController = require('./contacts.controller'),
    Twilio = require('../models/twilio');

module.exports = {
    showMessages: showMessages,
    showSingle: showSingle,
    seedMessages: seedMessages,
    showCreate: showCreate,
    processCreate: processCreate,
    deleteMessage: deleteMessage
};

/**
 * Show all messages
 */
function showMessages(req, res) {
    // get all messages
    Message.find({}, function (err, messages) {
        if (err) {
            res.status(404);
            res.send('Messages not found!');
        }

        // return a view with data
        res.render('pages/messages/show', {
            messages: messages,
            success: req.flash('success')
        });
    });
}

/**
 * Show a single message
 */
function showSingle(req, res) {
    // get a single message
    Message.findOne({slug: req.params.slug}, function (err, message) {
        if (err) {
            res.status(404);
            res.send('Message not found!');
        }

        res.render('pages/messages/single', {
            message: message,
            success: req.flash('success')
        });
    });
}

/**
 * Seed the database
 */
function seedMessages(req, res) {
    // create some messages
    const messages = [
        {device: "1", time: "1496156315783", contactId: '00', content: 'Super!'},
        {device: "1", time: "1496156315783", contactId: '01', content: 'Yo.'}
    ];

    // use the Message model to insert/save
    Message.remove({}, function () {
        for (message of messages) {
            var newMessage = new Message(message);
            newMessage.save();
        }
    });

    if (res.statusCode == 200)
        res.send('Database seeded!');
    else
        res.send('Error occurred!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
    res.render('pages/messages/create', {
        errors: req.flash('errors')
    });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
    // validate information
    req.checkBody('device', 'Device is required.').notEmpty();
    req.checkBody('time', 'Time is required.').notEmpty();
    req.checkBody('data', 'Data is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err = > err.msg);
    )
        return res.redirect('/messages/create');
    }

    console.log(JSON.stringify(req.body));
    // create a new message
    const message = new Message({
        device: req.body.device,
        time: req.body.time,
        contactId: req.body.data.slice(0, 2), // only keep the fist two bits
        content: decodeURIComponent(escape(hexToASCII(req.body.data.slice(2)))) // decode the HEX message (11 bytes)
    });

    // save message
    message.save(function (err) {
        if (err)
            throw err;

        // set a successful flash message
        req.flash('success', 'Successfully created message!');

        // redirect to the newly created message
        res.redirect('/messages/' + message.slug);
    });

    contactsController.getContactByMessageId(message.contactId, function (err, contact) {
        console.log(contact.phone);
        if (contact != null)
            Twilio.sendTwilio(message, contact.phone);
    });
}

/**
 * Delete a message
 */
function deleteMessage(req, res) {
    Message.remove({slug: req.params.slug}, function (err) {
        // set flash data
        // redirect back to the messages page
        req.flash('success', 'Message deleted!');
        res.redirect('/messages');
    });
}

// Utils
function hexToASCII(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}