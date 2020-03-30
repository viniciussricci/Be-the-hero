const express = require('express');

const ongController = require('./controllers/ongController');
const profileController = require('./controllers/profileController');
const sessionController = require('./controllers/sessionController');
const incidentController = require('./controllers/incidentController');

const routes = express.Router();

routes.post('/session', sessionController.create);

routes.get('/ongs', ongController.show);
routes.post('/ongs', ongController.store);

routes.get('/profile', profileController.showSpecific);

routes.post('/incidents', incidentController.store);
routes.get('/incidents', incidentController.show);
routes.delete('/incidents/:id', incidentController.delete);



module.exports = routes;
