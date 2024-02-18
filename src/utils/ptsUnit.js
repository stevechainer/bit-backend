// Calculate pts according to Utilities of Pool

//  Point Macro for each operation.
let DEPOSIT_PT;
let BORROW_PT;
let DISCOR_PT = 8;
let TELEGRAM_PT = 8;
let X_PT = 10;

const getPtsUnit = () => {
  return 1 / 100;
};

const getUSDTValue = (amout) => {
  return 500;
};

module.exports = {
  getPtsUnit,
  getUSDTValue,
  DISCOR_PT,
  TELEGRAM_PT,
  X_PT,
};
