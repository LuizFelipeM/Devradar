const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.get('/devs/:_id', DevController.show);
routes.post('/devs', DevController.store);
routes.patch('/devs/:_id', DevController.update);
routes.delete('/devs', DevController.destroy);

routes.get('/search', SearchController.index);

module.exports = routes;