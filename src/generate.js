const { generateLoan } = require('./generator/minimal')
const { LoanSettings } = require('./utils')

const settings = new LoanSettings({
  incomeAmount: 0,
  isPercentualInterest: false,
  previousReportingDate: new Date(2020, 0, 1),
  currentReportingDate: new Date(2020, 11, 31),
})
console.log('--DEBUG  ~ file: generate.js ~ line 3 ~ generateLoan', generateLoan(settings, 'new'))
