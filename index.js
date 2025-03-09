const express = require('express')
const {connectToMongoDb} = require('./connect');
const URL = require('./models/url')

const urlRoute = require('./routes/url')

const app = express();
const port = 8080;

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(() =>console.log("MongoDb Coonected....")
);

app.use(express.json())
app.use('/url', urlRoute);

app.get('/:shortId', async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory: {
                timestamp:Date.now(),
            }
        },
    })
    res.redirect(entry.redirectURL)
})
app.listen(port,() => console.log(`Server started at Port :${port}`)
)