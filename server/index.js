const { createStore } = require('redux')
const http = require('http')
const cp = require('child_process')
const express = require('express')
const createSocket = require('socket.io')
const cors = require('cors')

const PORT = 3333

const app = express()
const server = http.createServer(app)

app.use(cors())

const io = createSocket(server, {
  cors: {
    origin: '*'
  }
})

const UPDATE = 'update'

function nasdaqReducer(state = null, action) {
  switch (action.type) {
    case UPDATE:
      return {
        ...action.payload,
        timestamp: Date.now()
      }
    default:
      return state
  }
}

const nasdaqStore = createStore(nasdaqReducer)

// To connect with your mongoDB database
const mongoose = require('mongoose')
const { json } = require('express')

mongoose.connect('mongodb+srv://db-mongodb-nasdaq-whale-sfo3-db5bb0b2.mongo.ondigitalocean.com', {
    dbName: 'NasdaqDB',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'doadmin',
    pass: 'fK134FQUbI76092T',
    ssl: true,
    sslValidate: true,
    sslCA: `${__dirname}/ca-certificate.cer`,
}, err => {
  if (err) {
    console.log(err)
  } else { 
    console.log('Connected to NasdaqDB database')
  }
})

// Schema of nasdaqData for app
const NasdaqSchema = new mongoose.Schema({
  lastSalePrice: {
    type: Number,
    someId: mongoose.Schema.Types.ObjectId
  },
  timestamp: { 
    type: Date, 
    default: Date.now
  },
  updated: { 
    type: Date, 
    default: Date.now
  }
})

const NasdaqModel = mongoose.model('NasdaqModel', NasdaqSchema);

const getNasdaq = () => {
  const res = cp.execSync(
    `curl 'https://api.nasdaq.com/api/quote/COMP/info?assetclass=index' ` +
    `-H 'authority: api.nasdaq.com' ` +
    `-H 'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"' ` +
    `-H 'accept: application/json, text/plain, */*' ` +
    `-H 'sec-ch-ua-mobile: ?0' ` +
    `-H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36' ` +
    `-H 'sec-ch-ua-platform: "macOS"' ` +
    `-H 'origin: https://www.nasdaq.com' ` +
    `-H 'sec-fetch-site: same-site' ` +
    `-H 'sec-fetch-mode: cors' ` +
    `-H 'sec-fetch-dest: empty' ` +
    `-H 'referer: https://www.nasdaq.com/' ` +
    `-H 'accept-language: en-US,en;q=0.9,ru;q=0.8' ` +
    `--compressed`,
    {
      encoding: 'utf-8'
    }
  )

  return JSON.parse(res).data.primaryData
}

const startTime = '13:00:00'
const closeTime = '20:00:00'

function storeNasdaq() {
  let today = new Date()
  let time = today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds()
  let day = today.getUTCDay()

  const payload = getNasdaq()
  if (time >= startTime && time <= closeTime && day !== 0 && day !== 6) {
    nasdaqStore.dispatch({ payload, type: UPDATE })

    NasdaqModel.create({ 
      lastSalePrice: parseFloat(payload.lastSalePrice.replace(/,/g, '')),
    })

    console.log(payload)
  } else {
    console.log('Close Time')
  }
}

storeNasdaq()
setInterval(storeNasdaq, 1 * 60 * 1000)


io.on('connection', socket => {
  socket.emit('nasdaq', nasdaqStore.getState())

  nasdaqStore.subscribe(() => {
    socket.emit('nasdaq', nasdaqStore.getState())
  })
})

app.get('/', (req, res) => {
  res.json({ ok: true })
})

const mlSeconds = 60 * 60 * 1000

app.get('/all-nasdaq', async (req, res, next) => {
  try {
    const data = await NasdaqModel.find({ 
      timestamp: {
        $gt: new Date().valueOf() - mlSeconds
      }
    }).exec()

    if (data.length) {
      res.json({ ok: true, data })
    } else {
      const lastRecord = await NasdaqModel.findOne().sort({ timestamp: -1 }).exec()
      const lastRecordData = await NasdaqModel.find({
        timestamp: {
          $gt: new Date(lastRecord.timestamp).valueOf() - mlSeconds
        }
      }).exec()

      res.json({ ok: true, data: lastRecordData })
    }
  } catch (err) {
    res.status(500).json({ ok: false, err })
  }

  // console.log(data)

  // NasdaqModel.find({
  //   timestamp: {
  //     $gt: new Date().valueOf() - mlSeconds
  //   }
  // }, (err, data) => {
  //   if (err) {
  //     res.status(500).json({ ok: false, err })
  //   }
  //   else if (data.length !== 0) {
  //     res.json({
  //       ok: true,
  //       data
  //     })
  //   } else {
  //     NasdaqModel
  //       .findOne()
  //       .sort({ timestamp: -1 })
  //       .exec((err, data) => {
  //         if (err) {
  //           res.status(500).json({ ok: false, err })
  //         } else {
  //           NasdaqModel.find({
  //             timestamp: {
  //               $gt: new Date(data.timestamp).valueOf() - mlSeconds
  //             }
  //           }, (err, data) => {
  //             if (err) {
  //               res.status(500).json({ ok: false, err })
  //             }
  //             else {
  //               res.json({
  //                 ok: true,
  //                 data
  //               })
  //             }
  //           })
  //         }
  //       })
  //   }
  // })
})

server.listen(PORT, () => {
  console.log(`listening on: ${PORT}`)
})