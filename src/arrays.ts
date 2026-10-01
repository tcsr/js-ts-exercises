
let person = {
    name: 'Chandra',
    age: 40
}
let arr = ["Apple", "Banana", "Grapes", "Pineapple", "Cherry", person];
console.log(arr[5])

// Add or Remove elements
arr.push('orange');

arr.pop(); // Removes last element
arr.shift(); // Removes first element
arr.unshift("Orange"); // Add element to the first index
console.log(arr)

//NOTE: Push and POP are more performant thatn unshift and shift

// Looping an array

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
}

let i = 0;
while (i < arr.length) {
    // console.log(arr[i]);
    i++;
}

const numbers = [1, 2, 3, 4, 5];
const nuwNumbers = numbers.map((item, index, array) => {
    // console.log(item, index, array);
})

const filteredNumbers = numbers.filter((item) => item > 3);

const dupNumbers = [1, 2, 3, 4, 5, 6, 5, 2, 6, 7];
const uniqNumbers = Array.from(new Set(dupNumbers));
console.log(uniqNumbers);


// Remove duplicates [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]

const removeDuplicates = (nums: number[]) => {
    if (nums.length === 0) return { duplicateCount: 0, uniqueArray: [] };

    const originalLength = nums.length;
    let i = 0;

    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j]!;
        }
    }

    const uniqueCount = i + 1;
    const duplicateCount = originalLength - uniqueCount;

    // Chop dead tail rocks!
    nums.length = uniqueCount;

    return {
        duplicateCount,
        uniqueArray: nums
    };
};

console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 7, 7, 7]));


const removDupes = (nums: number[]): number => {
    if (nums.length === 0) return 0;

    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j]!;
        }
    }
    return (i + 1);
}
console.log('Remove Dupes:', removDupes([0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 7, 7, 7]))

// const nos = [5, 7, 3, 9, 1];
// const orderedNos = nos.sort((a, b) => (a - b));
// console.log(orderedNos)


// Two Sum: nums = [2, 7, 11, 15], target = 9, answer = [0, 1]
// 1. Create Map
// 2. Loop
// 3. Calculate complement
// 4. Check Map
// 5. If found → answer
// 6. Otherwise → store current

const twoSum = (nums: number[], target: number) => {

    const seen = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i]!;

        if (seen.has(complement)) {
            return [seen.get(complement)!, i]
        }

        seen.set(nums[i]!, i)

    }

    return [];
}

console.log(twoSum([2, 11, 7, 15], 9));


// Frequency
// ["a", "b", "a", "c", "a"] --> a → 3 b → 1 c → 1

const frequency = (chars: string[]) => {
    const freq = new Map<string, number>();

    for (const ch of chars) {
        freq.set(ch, (freq.get(ch) ?? 0) + 1);
    }
    return freq;
}

// console.log(frequency(["a", "b", "a", "c", "a", "c"]))

// Palindrome, string = 'madam', number=121

const isPalindrome = (value: string | number): boolean => {
    const s = String(value)

    let left = 0;
    let right = s.length - 1;

    while (left < right) {

        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

console.log(isPalindrome('madam'))
console.log(isPalindrome('madamm'))
console.log(isPalindrome(121))
console.log(isPalindrome(125))


// Fixed-Size Sliding Window, Problem: Find maximum sum of k consecutive elements.
// nums = [2, 1, 5, 1, 3, 2], k = 3, Answer:maximum sum = 9, numbers = [5, 1, 3], Complexity: Time  → O(n), Space → O(1)

// The possible windows are:
// [2, 1, 5] → 8  ==> Start with the first k = 3 numbers, Sum:2 + 1 + 5 = 8, Now slide the window one position to the right.
// [1, 5, 1] → 7
// [5, 1, 3] → 9  ← maximum
// [1, 3, 2] → 6

// Steps:
// Step1: let windowSum = 0; --> Current window's sum.
// Step2: let maxSum = -Infinity; --> We need to remember the largest sum we've seen.Using -Infinity also works correctly when all numbers are negative.
// Step3: for (let right = 0; right < nums.length; right++) --> right represents the new number entering the window.
// Step4: windowSum += nums[right]; --> Add the new number.
//   For example: right = 0 → add 2  right = 1 → add 1  right = 2 → add 5, Now:windowSum = 8
// Step5: if (right >= k - 1) --> Is the window full? For: k = 3 we need:right >= 2, When right = 2, we've collected:index:  0  1  2, value:  2  1  5
// Step6: maxSum = Math.max(maxSum, windowSum); Compare current window with previous maximum.
//   current = 8, maximum = 8 Next:current = 7, maximum = 8 Next:current = 9, maximum = 9
// Step7: windowSum -= nums[right - k + 1]; For:right = 2, k = 3 we get:2 - 3 + 1 = 0 So:windowSum -= nums[0];Remove: 2 because it is leaving the window.

// *** If you want to return numbers, indices as well, which can be useful in interviews:***

// function maxSum(nums: number[], k: number): {
//     maxSum: number;
//     numbers: number[];
//     startIndex: number;
//     endIndex: number;
// } {
//     let windowSum = 0;
//     let maxSum = -Infinity;

//     let bestStart = 0;
//     let bestEnd = 0;

//     for (let right = 0; right < nums.length; right++) {
//         windowSum += nums[right];

//         if (right >= k - 1) {
//             const left = right - k + 1;

//             if (windowSum > maxSum) {
//                 maxSum = windowSum;
//                 bestStart = left;
//                 bestEnd = right;
//             }

//             windowSum -= nums[left];
//         }
//     }

//     return {
//         maxSum,
//         numbers: nums.slice(bestStart, bestEnd + 1),
//         startIndex: bestStart,
//         endIndex: bestEnd
//     };
// }


/*
   * Sliding Window — Fixed Size
   *
   * 1. Maintain a window of exactly K consecutive elements.
   * 2. Expand the window by adding nums[right].
   * 3. Once the window reaches size K, process its sum.
   * 4. Update maxSum if the current window has a larger sum.
   * 5. Remove the leftmost element before sliding the window.
   * 6. Continue until right reaches the end of the array.
   *
   * Time  : O(n) — each element is added and removed once.
   * Space : O(1) — only variables are used.
   */

const maxSum = (nums: number[], k: number): number => {

    let windowSum = 0;
    let maxSum = -Infinity;

    for (let right = 0; right < nums.length; right++) {
        // Add new element
        windowSum += nums[right]!;

        // Once window reaches size k
        if (right >= k - 1) {
            // Check maximum
            maxSum = Math.max(maxSum, windowSum);

            // Remove element leaving the window
            const left = right - k + 1;
            windowSum -= nums[left]!;
        }
    }
    return maxSum;
}


/// The More Important Version — Dynamic Window
// Longest substring without repeating characters
// Example: "abcabcbb", Answer: "abc" Length: 3

function lengthOfLongestSubstring(s: string): number {
    const seen = new Set<string>();

    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right]!)) {
            seen.delete(s[left]!);
            left++;
        }

        seen.add(s[right]!);

        maxLength = Math.max(
            maxLength,
            right - left + 1
        );
    }

    return maxLength;
}