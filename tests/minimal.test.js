const { generateLoan } = require('../src/generator/minimal')
const { LoanSettings } = require('../src/utils')

const settings = new LoanSettings({
  incomeAmount: 0,
  isPercentualInterest: false,
  previousReportingDate: new Date(2020, 0, 1),
  currentReportingDate: new Date(2020, 11, 31),
})

test('Minimalistic Loan - Continuing, Valid, Realistic', () => {
  const { currentLoan } = generateLoan(settings, 'continuing', 'valid', true)

  expect(currentLoan.paymentAmount).toBeGreaterThanOrEqual(1000)
  expect(currentLoan.paymentAmount).toBeLessThanOrEqual(1_000_000_000)
  expect(currentLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
})

test('Minimalistic Loan - New, Valid, Realistic', () => {
  const { currentLoan } = generateLoan(settings, 'new', 'valid', true)

  expect(currentLoan.paymentAmount).toBeGreaterThanOrEqual(1000)
  expect(currentLoan.paymentAmount).toBeLessThanOrEqual(1_000_000_000)
  expect(currentLoan.paymentDate.getFullYear()).toBe(2020)
  expect(currentLoan.contractualEndDate.getFullYear()).toBeGreaterThan(2020)
})

test('Minimalistic Loan - Expired, Valid, Realistic', () => {
  const { previousLoan } = generateLoan(settings, 'expired', 'valid', true)

  expect(previousLoan.paymentAmount).toBeGreaterThanOrEqual(1000)
  expect(previousLoan.paymentAmount).toBeLessThanOrEqual(1_000_000_000)
  expect(previousLoan.paymentDate.getFullYear()).toBeLessThan(2020)
  expect(previousLoan.contractualEndDate.getFullYear()).toBe(2020)
})
