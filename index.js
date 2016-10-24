const express = require('express')
const http = require('http')
const compression = require('compression')
const app = express()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const cors = require('cors')
const port = process.env.PORT || 5000

app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.set('views', __dirname + '/dist/app')
app.use(compression())

// allow cors
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback('Origin Not Allowed', false)

//     var isAllowed = config.cors.whitelist.some((allowedDomain) => {
//       return origin.match('^' + allowedDomain)
//     })

//     // allowed domain
//     if (isAllowed) return callback(null, true)

//     // not allowed domain
//     callback('Origin Not Allowed', false)
//   }
// }

// parse application/json
app.use(bodyParser.json())

app.use(cors())

// app specific routes
require('./routes')(app)

// static routes
app.use(express.static(__dirname + '/dist/app/'))
app.use('/fonts', express.static(__dirname + '/dist/fonts'))
app.use('/img', express.static(__dirname + '/dist/img'))

// not found
app.use((req, res) => {
  res.sendStatus(404)
})

const server = http.createServer(app)
server.listen(port)
console.info(`--- server started on port ${port}`)
