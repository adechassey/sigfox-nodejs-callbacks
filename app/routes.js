// create a new express router
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    messagesController = require('./controllers/messages.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);

/************************
 MESSAGE
 ************************/
// message routes
router.get('/messages', messagesController.showMessages);

// seed messages
router.get('/messages/seed', messagesController.seedMessages);

// edit messages
router.get('/messages/:slug/edit', messagesController.showEdit);
router.post('/messages/:slug', messagesController.processEdit);

// delete messages
router.get('/messages/:slug/delete', messagesController.deleteMessage);

// show a single event
router.get('/messages/:slug', messagesController.showSingle);


/************************
 C0NTACT
 ************************/
// create contact
router.get('/contacts/create', messagesController.showCreate);
router.post('/contacts/create', messagesController.processCreate);