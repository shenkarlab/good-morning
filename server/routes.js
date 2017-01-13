var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
var db = require('./database')
const collection = 'processed_tweets'

router.use(bodyParser.json({limit: '5mb'}))
router.use(bodyParser.urlencoded({limit: '5mb', extended: true }))
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Content-Type', 'application/json')
    next()
})

router.get('/', (req, res) => {
    console.log('Get All Tweets')
    var tweets = db.get().collection(collection)
    tweets.find().limit(1000).toArray((err, docs) => {                       //limit because we have too many tweets - +25,000
        err ? res.status(404).send({error:err}) : res.jsonp({eqfeed_callback: docs})
    })
})

router.get('/country/:country', (req, res) => {
    var country = req.params.country
    console.log(`Get Tweets By Country - ${country}`)
    var tweets = db.get().collection(collection)
    tweets.find({"location.country": country}).toArray((err, docs) => {
        err ? res.status(404).send({error:err}) : res.status(200).send(docs)
    })
})

router.get('/word/:word', (req, res) => {
    var word = req.params.word
    console.log(`Get Tweets With Specific Word - ${word}`)
    var tweets = db.get().collection(collection)
    tweets.find({text: {$regex: `.*${word}.*`}}).toArray((err, docs) => {
        err ? res.status(404).send({error:err}) : res.status(200).send(docs)
    })
})

router.get('/time/:time', (req, res) => {
    var time = req.params.time
    console.log(`Get Tweets For Specific Time - ${time}`)
    var tweets = db.get().collection(collection)
    tweets.find({timestamp: time}).toArray((err, docs) => {
        err ? res.status(404).send({error:err}) : res.status(200).send(docs)
    })
})

module.exports = router