const numbers = [1, 2, 3, 4, 5];
const preFix = new Array(numbers.length + 1).fill(0);
// console.log(preFix);

for (let i = 0; i < numbers.length; i++) {
    preFix[i + 1] = preFix[i] + numbers[i]!;
}
// console.log(preFix);

// Basic
const buildPrefixSum = (nums: number[]): number[] => {
    const prefix = new Array<number>(nums.length + 1).fill(0);

    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i]! + nums[i]!;
    }
    return prefix;
}

// Range Sum Function
const buildRangeSum = (prefix: number[], left: number, right: number): number => {
    return prefix[right + 1]! - prefix[left]!;
}

const nums = [2, 4, 1, 3, 5];
const prefix = buildPrefixSum(nums);
console.log(prefix);
const rangeSum = buildRangeSum(prefix, 1, 3); //4 + 1 + 3 = 8
console.log(rangeSum);

// Subarray Sum Equals , Ex: nums = [1, 2, 3], k = 3
// Subarrays: [1,2] → 3, [3]   → 3, Answer: 2, This combines: Prefix Sum + Hash Map

function subarraySum(
    nums: number[],
    k: number
): number {

    const prefixCount = new Map<number, number>();

    // Empty prefix
    prefixCount.set(0, 1);

    let sum = 0;
    let count = 0;

    for (const num of nums) {
        sum += num;

        const needed = sum - k;

        if (prefixCount.has(needed)) {
            count += prefixCount.get(needed)!;
        }

        prefixCount.set(
            sum,
            (prefixCount.get(sum) ?? 0) + 1
        );
    }

    return count;
}

const subArrSum = subarraySum([1, 2, 3], 3);
console.log(subArrSum) // 2