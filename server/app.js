const later = require('later')

const handlerUpdate = require('./update')

// node app.js 设置自动更新
later.date.localTime()
later.setInterval(handlerUpdate, {
  schedules: [
    { h: [06], m: [00] },
    { h: [08], m: [00] },
    { h: [13], m: [16] },
    { h: [18], m: [00] },
    { h: [22], m: [00] },
  ]
})