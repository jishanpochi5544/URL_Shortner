const express = require('express')
const {connectToMongoDb} = require('./connect');
const URL = require('./models/url')

const path = require("path")

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const app = express();
const port = 8080;

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(() =>console.log("MongoDb Coonected....")
);


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/url', urlRoute);
app.get('/test',async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls:allUrls,
    })
})

/*
app.get('/test',async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls:allUrls,
    })
    // return res.end(`
    //     <html>
    //     <head></head>
    //     <body>
    //         <ol>
    //             ${allUrls
    //                 .map(
    //                     (url) =>
    //                         `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`
    //                 )
    //                 .join("")
    //             }
    //         </ol>
    //     </body>
    //     </html>
    //     `)
    // return res.end('<h1> Hey from server</h1>');
})

*/

app.use('/',staticRoute);

app.get('/url/:shortId', async (req,res)=>{
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