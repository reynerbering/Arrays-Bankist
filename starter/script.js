'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

createUsernames(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and welcome message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // then update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.textContent = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // delete account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];

// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map((mov, i) =>
//   mov > 0
//     ? `Movement ${i + 1}: You deposited ${mov}`
//     : `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`
// );
// console.log(movementsDescriptions);

// const deposists = movements.filter (mov => mov > 0);
// const withdrawals = movements.filter (mov => mov < 0);

// console.log(deposists);
// console.log(withdrawals);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// const maxValue = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   }else {
//     return mov;
//   }
// }, movements[0]);
// console.log(maxValue);

// const test1 = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = function (dogs) {
//   return dogs
//     .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
//     .filter(dog => dog >= 18)
//     .reduce((sum, age, _, arr) => sum + age / arr.length, 0);
// };

// console.log(calcAverageHumanAge(test1));

// const firstWithdrawal = movements.find(mov => mov < 0)
// console.log(firstWithdrawal);

// const account= accounts.find(acc => acc.owner === "Jessica Davis");
// console.log(account);

// const lastWithdrawal = movements.findLast(mov => mov < 0);
// const lastLargeMovement = movements.findLastIndex(mov => Math.abs(mov)> 1000);

// console.log (`Your latest large movement was ${movements.length - lastLargeMovement } movements ago`);

// console.log(movements);
// console.log(movements.includes(-130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[1, [2, 3]], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

/*const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
//1
const huskyWeight = breeds.find(dog => dog.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//2
const dogBothActivities = breeds.find(
  dog => dog.activities.includes('running') && dog.activities.includes('fetch'),
).breed;
console.log(dogBothActivities);

//3
const allActivities = breeds.flatMap(dog => dog.activities);
console.log(allActivities);

//4
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

//5
const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(dog => dog.activities.includes('swimming'))
      .flatMap(dog => dog.activities)
      .filter(activity => activity != 'swimming'),
  ),
];
console.log(swimmingAdjacent);

//6
const dogsAverageWeight = breeds.every(dog => dog.averageWeight >= 10);
console.log(dogsAverageWeight);

//7
const anyDogsActive = breeds.some(dogs => dogs.activities.length >= 3);
console.log(anyDogsActive);

const averageWeightOfHeaviestBreedThatLikesToFetch = breeds.filter(
  dogs => dogs.activities.includes('fetch'))
  .map(breed => breed.averageWeight);
const heaviestFetchBreed = Math.max(...averageWeightOfHeaviestBreedThatLikesToFetch);

  console.log(averageWeightOfHeaviestBreedThatLikesToFetch);
  console.log(heaviestFetchBreed);*/

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

console.log(movements);
movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(movements);
