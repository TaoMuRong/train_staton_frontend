/* eslint-disable no-unused-vars */
const express = require('express')
const Mock = require('mockjs')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')

const app = express()
app.all('*',function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 工具方法
function getJsonFile(filePath) {
  let json = fs.readFileSync(path.resolve(__dirname,filePath),'utf-8')
  return JSON5.parse(json)
}


// eslint-disable-next-line no-cond-assign,no-constant-condition
if (process.env.Mock = "true") {
  app.post('/member/login',function (rep,res) {
    let json = getJsonFile('./json/userInfo.json5')
    res.json(Mock.mock(json))
  })
  app.post('/member/logout',function (rep,res) {
    let json = getJsonFile('./json/logOut.json5')
    res.json(Mock.mock(json))
  })

}


app.use(cors())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
  extended: true
})) // for parsing application/x-www-form-urlencoded
app.get('/', (req, res) => {
  res.send('<h1>假后台</h1>')
})




app.listen('8090', () => {
  console.log('MockServer已启动');
})
