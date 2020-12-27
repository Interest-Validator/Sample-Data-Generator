class Loan {
  /**
   * Generates Loan with the attributes given from the Dataset Definition
   * @param {object} loan Loan data
   * @param {string} loan.contractId Contract ID of loan, used as primary key, must be unique
   * @param {number} loan.currentBalance Balance from the reporting Date
   * @param {number} loan.installmentRate Installment Rate of loan
   * @param {number} loan.interestRate Interest Rate of loan
   * @param {('A'|'I'|'T')} loan.redemptionMethod Method of redemption: 'A' for Anuity Loans, 'I' for Installment Loans and 'T' for Term Loans
   * @param {string} loan.curreny Currency Code after ISO 4217 used for loan values
   * @param {number} [loan.paymentAmount] Amount of first Payment
   * @param {Date} [loan.paymentDate] Date of first Payment, also begin of loan
   * @param {Date} [loan.contractualEndDate] Date of last Payment, end of loan
   * @param {number} [loan.yearlyInterestPayments=12] Amount of yearly interest payments
   * @param {number} [loan.yearlyRedemptionPayments=12] Amount of yearly redemption payments
   * @param {Date} [loan.interestPaymentDate=new Date(2020, 1, 15)] Regular Interest Payment Date
   * @param {Date} [loan.redemptionPaymentDate=new Date(2020, 1, 15)] Regular Redemption Payment Date
   * @param {('DE'|'EZ'|'AC')} [loan.interestMethod='DE'] Interest Method: 'DE' for german method, 'EZ' for Eurointerest method, 'AC' for ISMA-Method
   * @param {string} [loan.numberFormat='de-DE'] Code of BCP 47 Number Format of loan values
   */
  constructor(loan) {
    // Required Parameter -> No Defaults
    this.contractId = loan.contractId
    this.currentBalance = loan.currentBalance
    this.installmentRate = loan.installmentRate
    this.interestRate = loan.interestRate
    this.redemptionMethod = loan.redemptionMethod
    this.curreny = loan.curreny

    // Additional Data
    this.paymentAmount = loan.paymentAmount
    this.paymentDate = loan.paymentDate
    this.contractualEndDate = loan.contractualEndDate
    this.yearlyInterestPayments = loan.yearlyInterestPayments || 12
    this.yearlyRedemptionPayments = loan.yearlyRedemptionPayments || 12
    this.interestPaymentDate = loan.interestPaymentDate || new Date(2020, 0, 15)
    this.redemptionPaymentDate = loan.redemptionPaymentDate || new Date(2020, 0, 15)
    this.interestMethod = loan.interestMethod || 'DE'
    this.numberFormat = loan.numberFormat || 'de-DE'
  }

  toCSV() {
    return 0
  }

  toJSON() {
    return 0
  }

  toExcel() {
    return 0
  }

  toAccess() {
    return 0
  }
}

class LoanSettings {
  /**
   * Loan Settings and Parameter for calculation
   * @param {object} loanSettings Settings Data
   * @param {number} loanSettings.incomeAmount Amount of income from the P&L
   * @param {boolean} loanSettings.isPercentualInterest Whether the insterest rate is in perent or dezimla
   * @param {Date} loanSettings.previousReportingDate The Date where the Loan was generated
   * @param {Date} loanSettings.currentReportingDate The Date where the Loan was generated
   * @param {Date} [loanSettings.considerationStartDate=loanSettings.previousReportingDate] Begin of Consideration Period
   * @param {Date} [loanSettings.considerationEndDate=loanSettings.currentReportingDate] End of Consideration Period
   * @param {boolean} [loanSettings.withCutoff=false] If Loans should calculated with Cutoff
   * @param {string} [loanSettings.dateFormat='DD.MM.YYYY'] Format of provided Dates
   */
  constructor(loanSettings) {
    // Required fields
    this.incomeAmount = loanSettings.incomeAmount
    this.isPercentualInterest = loanSettings.isPercentualInterest
    this.currentReportingDate = loanSettings.currentReportingDate
    this.previousReportingDate = loanSettings.previousReportingDate

    // Required field but with defaults
    this.considerationStartDate = loanSettings.considerationStartDate || loanSettings.previousReportingDate
    this.considerationEndDate = loanSettings.considerationEndDate || loanSettings.currentReportingDate
    this.withCutoff = loanSettings.withCutoff || false
    this.dateFormat = loanSettings.dateFormat || 'DD.MM.YYYY'

    // Additional data
    this.seperator = loanSettings.seperator || ';'
  }
}

/**
 * Rounds a Float more correct than the normal Math.round or toFixed, but still doesn't always correct
 * @param {number} number To be rounded value
 * @param {number} digits Amount of digits, default 2
 */
function correctRound(number, digits) {
  digits = typeof digits === 'number' ? digits : 2
  const rounder = Math.pow(10, digits)
  return +Math.round((number + Number.EPSILON) * rounder) / rounder
}

/**
 * Return a random Integer in a specific range
 * @param {number} min Inclusive Minimum
 * @param {number} max Inclusive Maximum
 */
function randomInt(min, max) {
  return parseInt(Math.random() * (max - min) + min)
}

/**
 * Return a random Float in a specific range
 * @param {number} min Inclusive Minimum
 * @param {number} max Inclusive Maximum
 * @param {number} [digits=2] Amount of digits
 */
function randomFloat(min, max, digits) {
  return correctRound(Math.random() * (max - min) + min, digits)
}

/**
 * Returns a random Date between min and max
 * @param {Date} min Earliest possible Date
 * @param {Date} max Latest possible Date
 */
function randomDate(min, max) {
  return new Date(Math.random() * (max.getTime() - min.getTime()) + min.getTime())
}

/**
 * Returns a random number generated with the normal distribution with the Box-Mueller-Transform
 * @param {number} min Inclusive Minimum
 * @param {number} max Inclusive Maximum
 * @param {number} skew Skew Factor
 * @param {number} [digits=2] Amount of digits
 */
function randomNBM(min, max, skew, digits) {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randomNBM(min, max, skew) // resample between 0 and 1 if out of range
  num = Math.pow(num, skew) // Skew
  num *= max - min // Stretch to fill range
  num += min // offset to min

  return correctRound(num, digits)
}

function monthDiff(d1, d2) {
  let months
  months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()
  return months <= 0 ? 0 : months
}

const random = {
  Int: randomInt,
  Float: randomFloat,
  Date: randomDate,
  NBM: randomNBM,
}

const dates = {
  monthDifference: monthDiff,
}

module.exports = { random, dates, Loan, LoanSettings, correctRound }
