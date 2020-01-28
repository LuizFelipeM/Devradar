const parseStringAsArray = require('../utils/parseStringAsArray');
const Dev = require('../models/dev');

module.exports = {
    async index(req, res){
        const { latitude, longitude, techs } = req.query;

        const techsA = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsA
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })

        return res.json(devs);
    }
}