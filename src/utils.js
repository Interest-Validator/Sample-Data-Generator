/**
 * Rounds a Float more correct than the normal Math.round or toFixed, but still doesn't always correct
 * @param {number} number To be rounded value
 * @param {number} digits Amount of digits, default 2
 */
function correctRound(number, digits) {
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
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Return a random Float in a specific range with two digits
 * @param {number} min Inclusive Minimum
 * @param {number} max Inclusive Maximum
 * @param {number} digits Number of digits
 */
function randomAmount(min, max, digits) {
  digits = digits ? Math.round(digits) : 2
  let amount = randomFloat(min, max)
  amount = correctRound(amount, digits)
  return amount
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
 */
function randomNBM(min, max, skew) {
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
  return num
}

module.exports = {
  randomInt,
  randomFloat,
  randomAmount,
  randomDate,
  correctRound,
  randomNBM,
}
