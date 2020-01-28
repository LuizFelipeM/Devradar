const axios = require('axios');
const Dev = require('../models/dev');

const { findConnections, sendMessage } = require('../websocket');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async show(req, res){
        const dev = await Dev.findById(req.params);
        
        return res.json(dev);
    },

    async store(req, res){
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const gitRes = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = github_username, avatar_url, bio } = gitRes.data;

            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ]
            }

            const techsA = parseStringAsArray(techs);

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsA,
                location
            });

            // Filtrar as conexões que estão há no máximo 10Km de distância
            // e que o novo tenha pelo menos uma das techs filtradas
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsA
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return res.json(dev);
    },

    async update(req, res){
        const _id = req.params;
        const { techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ _id });

        if(dev){
            const gitRes = await axios.get(`https://api.github.com/users/${dev.github_username}`);

            const { name = github_username, avatar_url, bio } = gitRes.data;

            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ]
            }

            const techsA = parseStringAsArray(techs);

            dev = await Dev.findOneAndUpdate({ _id }, {
                name,
                avatar_url,
                bio,
                techs: techsA,
                location
            }, {
                new: true,
                upsert: false
            }, (err) => { if(err) handleError(err) });
        }else
            return res.status(406).json({ error: 'User does not exist' });

        return res.json(dev);
    },

    async destroy(req, res){
        const { github_username } = req.headers;
        const response = await Dev.deleteOne({ github_username }, (err) => { if(err) return handleError(err) });

        return res.json(response)
    }
}