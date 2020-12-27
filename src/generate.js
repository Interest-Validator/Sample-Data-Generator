const path = require('path')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const { generateLoan } = require('./generator/minimal')
const { LoanSettings, random } = require('./utils')

const dirname = path.join(__dirname, '..', 'samples')
if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

const settings = new LoanSettings({
  incomeAmount: 0,
  isPercentualInterest: false,
  previousReportingDate: new Date(2020, 0, 1),
  currentReportingDate: new Date(2020, 11, 31),
})

/**
 * Generates Loan Sample Files
 * @param {string} name File Name
 * @param {('Excel'|'CSV'|'Access')} ftype File Type, JSON File will always be generated
 * @param {number} n Number of Loans
 * @param {object} settings Loan Settings
 * @param {('valid'|'invalid'|'warn'|'error')} [mode='valid'] Whether the Loan should be valid or raise warning or errors in calculation
 * @param {boolean} [realistic=true] Generates Loans values with normal distribution
 */
async function generateFile(name, ftype, n, settings, mode, realistic) {
  mode = mode === 'warn' || mode === 'error' || mode === 'invalid' ? mode : 'valid'
  realistic = typeof realistic === 'boolean' ? realistic : true

  const dirname = path.join(__dirname, '..', 'samples', name)
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

  const types = ['continuing', 'expired', 'new']
  const currentLoans = []
  const previousLoans = []
  for (let i = 0; i < n; i++) {
    let rnd = random.Int(0, 2)
    if (realistic) {
      rnd = random.Float(0, 100)
      if (rnd < 80) {
        rnd = 0
      } else {
        rnd = random.Int(1, 2)
      }
    }
    const type = types[rnd]
    const { currentLoan, previousLoan } = generateLoan(settings, type, mode, realistic)
    if (currentLoan) currentLoans.push(currentLoan.toObject(settings.dateFormat))
    if (previousLoan) previousLoans.push(previousLoan.toObject(settings.dateFormat))
  }

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

  if (ftype === 'CSV') {
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
}

generateFile('minimal-realistic', 'CSV', 100, settings, 'valid', true)
generateFile('minimal-unrealistic', 'CSV', 100, settings, 'valid', false)
