var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
var db = require('./database')
const collection = 'new_processed_tweets'

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
    tweets.find({}, { user: 0, picture: 0, text: 0, timestamp: 0, location: 0 }).limit(15000).toArray((err, docs) => {                       //limit because we have too many tweets - +25,000
        err ? res.status(404).send({error:err}) : res.status(200).send(docs)
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

router.get('/time/:from/:to', (req, res) => {
    var from = parseInt(req.params.from)
    var to = parseInt(req.params.to)
    console.log(`Get All Tweets Betweeen ${from} - ${to}`)
    var tweets = db.get().collection(collection)
    tweets.find({time: {$gt: from - 1, $lt: to + 1}}, { user: 0, picture: 0, text: 0, timestamp: 0, location: 0, time: 0 }).limit(15000).toArray((err, docs) => {
        err ? res.status(404).send({error:err}) : res.status(200).send(docs)
    })
})

module.exports = router