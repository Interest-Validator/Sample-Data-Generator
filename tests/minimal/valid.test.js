const { generateLoan } = require('../../src/generator/minimal')
const { dates, LoanSettings } = require('../../src/utils')

const settings = new LoanSettings({
  incomeAmount: 0,
  isPercentualInterest: false,
  previousReportingDate: new Date(2020, 0, 1),
  currentReportingDate: new Date(2020, 11, 31),
})

function calcTerm(K, R, q) {
  const i = q - 1
  const lnikr = Math.log(1 - (i * K) / R)
  const lnq = Math.log(q)
  const term = -lnikr / lnq
  return Math.round(term)
}

function testAll(loan) {
  expect(loan.paymentAmount).toBeGreaterThanOrEqual(1000)
  expect(loan.paymentAmount).toBeLessThanOrEqual(1_000_000_000)

  expect(loan.interestRate).toBeGreaterThanOrEqual(0.0001)
  expect(loan.interestRate).toBeLessThanOrEqual(0.1)

  expect(loan.currentBalance).toBeLessThanOrEqual(loan.paymentAmount)
  expect(loan.currentBalance).toBeLessThanOrEqual(loan.paymentAmount)

  const n = dates.monthDifference(loan.paymentDate, loan.contractualEndDate)
  const K = loan.paymentAmount
  const R = loan.installmentRate
  const q = Math.pow(loan.interestRate + 1, 1 / 12)
  expect(n).toBe(calcTerm(K, R, q))
  expect(n).toBeLessThanOrEqual(50 * 12)
  expect(loan.installmentRate).toBeLessThan(loan.paymentDate / n)
}

function testAllRealistic(loan) {
  expect(loan.interestRate).toBeGreaterThanOrEqual(0.001)
  expect(loan.interestRate).toBeLessThanOrEqual(0.07)
}

test('Minimalistic Valid Loan - Continuing, Realistic', () => {
  const { currentLoan, previousLoan } = generateLoan(settings, 'continuing', 'valid', true)
  testAll(currentLoan)
  testAll(previousLoan)
  testAllRealistic(currentLoan)
  testAllRealistic(previousLoan)

  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
  expect(previousLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(currentLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(previousLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
})

test('Minimalistic Valid Loan - Continuing, Unrealistic', () => {
  const { currentLoan, previousLoan } = generateLoan(settings, 'continuing', 'valid', false)
  testAll(currentLoan)
  testAll(previousLoan)

  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
  expect(previousLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(currentLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(previousLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
})

test('Minimalistic Valid Loan - New, Realistic', () => {
  const { currentLoan } = generateLoan(settings, 'new', 'valid', true)
  testAll(currentLoan)
  testAllRealistic(currentLoan)

  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
  expect(currentLoan.paymentDate.getFullYear()).toBe(2020)
})

test('Minimalistic Valid Loan - New, Unrealistic', () => {
  const { currentLoan } = generateLoan(settings, 'new', 'valid', false)
  testAll(currentLoan)

  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
  expect(currentLoan.paymentDate.getFullYear()).toBe(2020)
})

test('Minimalistic Valid Loan - Expired, Realistic', () => {
  const { previousLoan } = generateLoan(settings, 'expired', 'valid', true)
  testAll(previousLoan)
  testAllRealistic(previousLoan)

  expect(previousLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(previousLoan.contractualEndDate.getFullYear()).toBe(2020)
})

test('Minimalistic Valid Loan - Expired, Unrealistic', () => {
  const { previousLoan } = generateLoan(settings, 'expired', 'valid', false)
  testAll(previousLoan)

  expect(previousLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(previousLoan.contractualEndDate.getFullYear()).toBe(2020)
})
