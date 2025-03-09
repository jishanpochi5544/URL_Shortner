// const  shortid  = require("shortid"); 

const URL = require('../models/url');

const { nanoid } = require("nanoid");


async function handleGenerateNewShortURL(req, res) {
    // const shortID = shortid.generate();
    const shortID = nanoid(8);
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.json({ id: shortID });
}

module.exports = {
    handleGenerateNewShortURL,
};
