// const myNums = [23, 34, 9, 55, 12, 99];
// const sortedNums = myNums.sort((a, b) => (a - b))
// console.log(sortedNums);

// let obj = { id: 1, name: 'Chandra', email: 'Chandra@gmail.com' }
// console.log(Object.keys(obj));

// const obj1 = { id: 1, name: 'My Obj' };
// const obj2 = { phone: '8999999', address: 'Chennai' };
// const combObj = Object.assign({}, obj1, obj2);
// console.log(combObj);

// // call, apply & bind
// var emp1 = { firstName: 'John', lastName: 'Doe' }
// var emp2 = { firstName: 'Jimmy', lastName: 'Bailly' }

// function invite(this: any, greeting1: string, greeting2: string) {
//     return `${greeting1} ${this.firstName} ${this.lastName} ${greeting2}`;
// }

// console.log(invite.call(emp1, "Hello", "how are you"));   // call()
// console.log(invite.apply(emp1, ['Hey', "What's up"])); // apply()
// const inviteEmp1 = invite.bind(emp2);
// console.log(inviteEmp1("Hey", "How is going")); // bind()

// // Array slice(start, end)
// const arrayToBeSliced = [2, 3, 8, 90, 8, 9, 11, 13, 5];
// const slice1 = arrayToBeSliced.slice(0);
// const slice2 = arrayToBeSliced.slice(1);
// const slice3 = arrayToBeSliced.slice(6);
// // console.log(slice1, slice2, slice3)

// const numbers = [3, 8, 9, 99, 67, 89];
// const sum = numbers.reduce((acc, cv) => {
//     return acc + cv;
// })

// console.log(sum);

// const nestedArray = [1, 2, [4, 5], [[[3, 4, 5, 6, 7, 9, 11, 12, 14, 55]]]]
// console.log(nestedArray.flat(Infinity))



// Palindrome
const isPalindrome = (number: number): boolean => {
    return number < 0 ? false : number === +number.toString().split("").reverse().join("");
}
console.log(isPalindrome(123))


// Anagram --> An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase,
//             using all the original letters exactly once.

const isAnagram = (s: string, t: string) => {
    s = s.split("").sort().join("");
    t = t.split("").sort().join("");
    return s === t;
}

console.log('Anagram:', isAnagram('anagram', 'nagaram'));


// Set
const myNumbers = [1, 2, 3, 5, 6, 7, 10, 11, 7];
const seen = new Set<number>(myNumbers);

// for (const number of myNumbers) {
//     if (seen.has(number)) {
//         // return (true);
//     }

//     seen.add(number);
// }

console.log(seen);

//********** Maps ************/

const indexMap = new Map<string, number>();
indexMap.set('Chandra', 41);
indexMap.set('Sai', 41);
indexMap.set('Chandra', 42);
console.log(indexMap)

const myNumbers1 = [3, 4, 5, 6, 7, 8, 9, 11, 3, 4, 5, 5, 6, 7, 5];

const frequency = new Map<number, number>();

for (const num of myNumbers1) {
    frequency.set(num, (frequency.get(num) ?? 0) + 1);
}

console.log(frequency.get(5));