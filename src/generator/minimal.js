const { v4: uuidv4 } = require('uuid')
const { random, Loan, correctRound, dates } = require('../utils')

function generatePaymentAmount(realistic) {
  const min = 1_000
  const max = 1_000_000_000
  return realistic ? random.NBM(min, max, 15) : random.Float(min, max)
}

function generatePaymentDate(settings, type, mode, realistic) {
  let min, max
  let paymentDate, contractualEndDate, term
  if (realistic) {
    const reportingPeriodStart = new Date(settings.previousReportingDate)
    const reportingPeriodEnd = new Date(settings.currentReportingDate)

    term = parseInt(random.NBM(1, 50, 1)) // Years
    if (type === 'continuing') {
      min = new Date(reportingPeriodEnd)
      min.setFullYear(min.getFullYear() - term)
      max = new Date(reportingPeriodStart)

      paymentDate = random.Date(min, max)

      contractualEndDate = new Date(paymentDate)
      contractualEndDate.setFullYear(contractualEndDate.getFullYear() + term)
    } else if (type === 'new') {
      min = new Date(reportingPeriodStart)
      max = new Date(reportingPeriodEnd)

      paymentDate = random.Date(min, max)

      contractualEndDate = new Date(paymentDate)
      contractualEndDate.setFullYear(contractualEndDate.getFullYear() + term)
    } else if (type === 'expired') {
      min = new Date(reportingPeriodStart)
      max = new Date(reportingPeriodEnd)

      contractualEndDate = random.Date(min, max)

      paymentDate = new Date(contractualEndDate)
      paymentDate.setFullYear(paymentDate.getFullYear() - term)
    }
  }

  return { paymentDate, contractualEndDate, term }
}

function generateInterestRate(realistic) {
  const min = realistic ? 0.001 : 0.0001
  const max = realistic ? 0.07 : 0.1
  return realistic ? random.NBM(min, max, 1, 4) : random.Float(min, max, 4)
}

function calculateInstallmentRate(K, q, n) {
  const qn = Math.pow(q, n)
  const i = q - 1
  const rate = (K * qn * i) / (qn - 1)
  return correctRound(rate)
}

function calculateCurrentBalance(K, q, n, t) {
  const qn = Math.pow(q, n)
  const qt = Math.pow(q, t)
  const balance = (K * (qn - qt)) / (qn - 1)
  return correctRound(balance)
}

/**
 * Generates a Minimalistic Loan
 * @param {object} settings Loan Settings
 * @param {('continuing'|'expired'|'new')} [type='continuing'] Type of Loan
 * @param {('valid'|'invalid'|'warn'|'error')} [mode='valid'] Whether the Loan should be valid or raise warning or errors in calculation
 * @param {boolean} [realistic=true] Generates Loans values with normal distribution
 */
function generateLoan(settings, type, mode, realistic) {
  type = type === 'expired' || type === 'new' ? type : 'continuing'
  mode = mode === 'warn' || mode === 'error' || mode === 'invalid' ? mode : 'valid'
  realistic = typeof realistic === 'boolean' ? realistic : true

  const contractId = uuidv4()
  const redemptionMethod = 'A'
  const curreny = 'EUR'

  const interestRate = generateInterestRate(realistic)
  const paymentAmount = generatePaymentAmount(realistic)

  const { paymentDate, contractualEndDate, term } = generatePaymentDate(settings, type, mode, realistic)

  const q = Math.pow(interestRate + 1, 1 / 12)
  const n = term * 12
  const installmentRate = calculateInstallmentRate(paymentAmount, q, n)

  let previousLoan, currentLoan

  if (type === 'continuing' || type === 'expired') {
    const previousTerms = dates.monthDifference(paymentDate, settings.previousReportingDate)
    const previousBalance = calculateCurrentBalance(paymentAmount, q, n, previousTerms)
    previousLoan = new Loan({
      contractId,
      currentBalance: previousBalance,
      installmentRate,
      interestRate,
      redemptionMethod,
      curreny,

      paymentAmount,
      paymentDate,
      contractualEndDate,
    })
  }
  if (type === 'continuing' || type === 'new') {
    const currentTerms = dates.monthDifference(paymentDate, settings.currentReportingDate)
    const currentBalance = calculateCurrentBalance(paymentAmount, q, n, currentTerms)
    currentLoan = new Loan({
      contractId,
      currentBalance: currentBalance,
      installmentRate,
      interestRate,
      redemptionMethod,
      curreny,

      paymentAmount,
      paymentDate,
      contractualEndDate,
    })
  }

  return { previousLoan, currentLoan }
}

module.exports = {
  generateLoan,
}
