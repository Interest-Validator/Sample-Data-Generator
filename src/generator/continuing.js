const { v4: uuidv4 } = require('uuid')

const { random, Loan, correctRound } = require('../utils')

/**
 * Generates a Loan with the following properties:
 * Simple - Loan with minimum requirements (id, balance, rate, interest, startDate) with a period duration of 12 month - Alternative would be Complex with all possible Parameters
 * Valid - Loan shouldn't raise an Error nor a Warning when calculated - Alternative would be Error or Warning
 * Realistic - More Realistic generation of random values with normal distribution
 * Continuing - Normal Loan, returns currentLoan and recentLoan - Alternatives would be New or Expiring
 */
function generateSimpleValidRealisticContinuingLoan() {
  const id = uuidv4()
  const currentBalance = random.NBM(0.01, 1_000_000_000, 15)

  const nominalInterest = random.NBM(0.1, 10, 2)

  const today = new Date()
  const minDate = new Date(today.getFullYear() - 1, 0, 1)
  const maxDate = new Date(today.getFullYear() - 10, 0, 1)
  const startDate = random.Date(minDate, maxDate)

  const minTerm = 1
  const maxTerm = 5
  const term = random.Int(minTerm, maxTerm)

  // Simple annuity formular
  const K = currentBalance
  const q = 1 + nominalInterest / 100
  const n = term * 12
  const rate = correctRound((K * Math.pow(q, n) * (q - 1)) / (Math.pow(q, n) - 1))

  // Loan from the end of this period
  const currentLoan = new Loan(id, currentBalance, rate, nominalInterest, startDate)

  let previousBalance = currentBalance
  for (let i = 0; i < 12; i++) {
    previousBalance = correctRound((previousBalance + rate) / (1 + (q - 1) * (30 / 360)), 2)
  }

  // Loan from the beginn of this period
  const previousLoan = new Loan(id, previousBalance, rate, nominalInterest, startDate)

  return { currentLoan, previousLoan }
}

module.exports = { generateSimpleValidRealisticContinuingLoan }
