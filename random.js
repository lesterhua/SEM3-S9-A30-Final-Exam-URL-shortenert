const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
const upperCase = lowerCase.toUpperCase()
const number = '0123456789'

let collection = lowerCase.split('').concat(upperCase.split('')).concat(number.split(''))
// console.log(collection)

const generateRandomNumber = () => {
  let randomNumber = ''
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * collection.length)
    randomNumber += collection[randomIndex]
  }
  return randomNumber
}
// console.log(randomNumber)
module.exports = generateRandomNumber

