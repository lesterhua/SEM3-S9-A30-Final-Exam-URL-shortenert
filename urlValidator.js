const { check, validationResult } = require('express-validator')

module.exports = {
  urlValidator: [
    check('link')
      .trim()
      .isURL()
      .withMessage('請輸入正確的網址且不可為空白!')
  ]
}