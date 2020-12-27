const path = require('path')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const minimal = require('./generator/minimal')
const { random } = require('./utils')

const types = ['continuing', 'expired', 'new']
function getType(realistic) {
  let rnd = random.Int(0, 2)
  if (realistic) {
    rnd = random.Float(0, 100)
    if (rnd < 80) {
      rnd = 0
    } else {
      rnd = random.Int(1, 2)
    }
  }
  return types[rnd]
}

/**
 * Generates Loan Sample Files
 * @param {string} name File Name
 * @param {('minimal'|'full'|'all-options')} stype Sample Type
 * @param {number} n Number of Loans
 * @param {object} settings Loan Settings
 * @param {boolean} [realistic=true] Generates Loans values with normal distribution
 */
async function generateFile(name, stype, n, settings, realistic) {
  realistic = typeof realistic === 'boolean' ? realistic : true

  const dirname = path.join(__dirname, '..', 'samples', name)
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

  let currentLoans, previousLoans

  if (stype === 'minimal') {
    currentLoans = []
    previousLoans = []
    for (let i = 0; i < n; i++) {
      const type = getType(realistic)
      const { currentLoan, previousLoan } = minimal.generateLoan(settings, type, 'valid', realistic)
      if (currentLoan) currentLoans.push(currentLoan.toObject(settings.dateFormat))
      if (previousLoan) previousLoans.push(previousLoan.toObject(settings.dateFormat))
    }
  }

  const json = JSON.stringify({ settings: settings.toObject(false), currentLoans, previousLoans })
  fs.writeFileSync(path.join(dirname, name + '.json'), json)

  const settingsAsJson = JSON.stringify(settings.toObject(false))
  fs.writeFileSync(path.join(dirname, name + '.settings.json'), settingsAsJson)

  const header = [
    { id: 'contractId', title: 'Contract ID' },
    { id: 'currentBalance', title: 'Current Balance' },
    { id: 'installmentRate', title: 'Installment Rate' },
    { id: 'interestRate', title: 'Interest Rate' },
    { id: 'redemptionMethod', title: 'Redemption Methods' },
    { id: 'currency', title: 'Currency' },
    { id: 'paymentAmount', title: 'Payment Amount' },
    { id: 'paymentDate', title: 'Payment Date' },
    { id: 'contractualEndDate', title: 'Contractual End Date' },
    { id: 'yearlyInterestPayments', title: 'Yearly Interest Payments' },
    { id: 'yearlyRedemptionPayments', title: 'Yearly Redemption Payments' },
    { id: 'interestPaymentDate', title: 'Interest Payment Date' },
    { id: 'redemptionPaymentDate', title: 'Redemption Payment Date' },
    { id: 'interestMethod', title: 'Interest Method' },
    { id: 'numberFormat', title: 'Number Format' },
  ]

  const currentCsvWriter = createCsvWriter({
    path: path.join(dirname, name + '.current.csv'),
    header,
  })

  currentCsvWriter.writeRecords(currentLoans).then(() => {
    console.log('...Done')
  })

  const previousCsvWriter = createCsvWriter({
    path: path.join(dirname, name + '.previous.csv'),
    header,
  })

  previousCsvWriter.writeRecords(previousLoans).then(() => {
    console.log('...Done')
  })
}

module.exports = { generateFile }
