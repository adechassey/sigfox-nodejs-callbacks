const Message = require('../models/message');

module.exports = {
    showMessages: showMessages,
    showSingle: showSingle,
    seedMessages: seedMessages,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
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
        res.render('pages/messages', {
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

        res.render('pages/single', {
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
        {name: 'Basketball', description: 'Throwing into a basket.'},
        {name: 'Swimming', description: 'Michael Phelps is the fast fish.'},
        {name: 'Weightlifting', description: 'Lifting heavy things up'},
        {name: 'Ping Pong', description: 'Super fast paddles'}
    ];

    // use the Message model to insert/save
    Message.remove({}, function () {
        for (message in messages) {
            var newMessage = new Message(message);
            newMessage.save();
        }
    });

    // seeded!
    res.send('Database seeded!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
    res.render('pages/create', {
        errors: req.flash('errors')
    });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(function (err) {
            err.msg
        }));
        return res.redirect('/messages/create');
    }

    // create a new message
    const message = new Message({
        name: req.body.name,
        description: req.body.description
    });

    // save message
    message.save(function (err) {
        if (err)
            throw err;

        // set a successful flash message
        req.flash('success', 'Successfuly created message!');

        // redirect to the newly created message
        res.redirect('/messages/' + message.slug);
    });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Message.findOne({slug: req.params.slug}, function (err, message) {
        res.render('pages/edit', {
            message: message,
            errors: req.flash('errors')
        });
    });
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(function (err) {
            err.msg
        }));
        return res.redirect('/messages/' + req.params.slug + '/edit');
    }

    // finding a current message
    Message.findOne({slug: req.params.slug}, function (err, message) {
        // updating that message
        message.name = req.body.name;
        message.description = req.body.description;

        message.save(function (err) {
            if (err)
                throw err;

            // success flash message
            // redirect back to the /messages
            req.flash('success', 'Successfully updated message.');
            res.redirect('/messages');
        });
    });

}

/**
 * Delete an message
 */
function deleteMessage(req, res) {
    Message.remove({slug: req.params.slug}, function (err) {
        // set flash data
        // redirect back to the messages page
        req.flash('success', 'Message deleted!');
        res.redirect('/messages');
    });
}