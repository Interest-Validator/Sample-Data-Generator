const fs = require('fs')
const path = require('path')
const express = require('express')
const { generateFile } = require('./generate')
const { LoanSettings } = require('./utils')

const app = express()
const port = process.env.PORT || 3301

const dirname = path.join(__dirname, '..', 'samples')
if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

const settings = new LoanSettings({
  incomeAmount: 0,
  isPercentualInterest: false,
  previousReportingDate: new Date(2020, 0, 1),
  currentReportingDate: new Date(2020, 11, 31),
})

app.use(express.json())
app.use(express.static('samples'))

app.get('/sample', async (req, res) => {
  const stype = req.query.sample
  const n = parseInt(req.query.n || 100)
  const realistic = req.query.realistic === 'true' ? 'realistic' : 'unrealistic'

  if (stype !== 'minimal' && stype !== 'full' && stype !== 'all-options')
    return res.status(400).json({ error: 'Bad Request!' }).end()
  if (isNaN(n)) return res.status(400).json({ error: 'Bad Request!' }).end()

  const fname = `${stype}-${realistic}-${n}`
  const dirname = path.join(__dirname, '..', 'samples', fname)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname)
    await generateFile(fname, stype, n, settings, realistic)
  }

  const data = JSON.parse(fs.readFileSync(path.join(dirname, fname + '.json')))
  return res.status(200).json(data).end()
})

// TODO:
app.get('/download', (req, res) => {})

app.get('*', (req, res) => {
  res.end('App started')
})

app.listen(port, () => {
  console.log(`App startet!\n - Local: http://localhost:${port}\n`)
  console.log(
    `Get realistic and minimal sample in JSON format with:
    http://localhost:${port}/sample?sample=minimal&realistic=true&n=100&mode=valid`,
  )
})
