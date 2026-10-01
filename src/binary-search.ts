// Remeber:
// 1. mid = middle
// 2. target > nums[mid] → move LEFT
// 3. target < nums[mid] → move RIGHT

/*
 * Binary Search
 *
 * 1. Search within a sorted / monotonic search space.
 * 2. Find the middle element.
 * 3. If target === middle → found.
 * 4. If target > middle → search right half.
 * 5. If target < middle → search left half.
 * 6. Repeat until search space is empty.
 *
 * Time  : O(log n)
 * Space : O(1)
 *
 * Variations:
 * - First / Last occurrence
 * - Boundary search
 * - Rotated sorted array
 * - Binary Search on Answer
 */
// The one-line memory trick: Compare with MID → eliminate half → repeat.


// Example:******************************************************* 
// Basic Binary Search, nums = [1, 3, 5, 7, 9, 11, 13], target = 11
// Use: left = 0, right = 6 ~(nums.length -  1)
// Calculate: mid = Math.floor((left + right) / 2), mid = 3, nums[3] = 7
// Compare: 7 < 11, Therefore target must be on the right: left = mid + 1
// Now: left = 4, right = 6, Middle: mid = 5, nums[5] = 11, Found.

function binarySearch(
    nums: number[],
    target: number
): number {

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {

        const mid = Math.floor(
            left + (right - left) / 2
        );

        if (nums[mid] === target) {
            return mid;
        }

        if (nums[mid]! < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9, 11, 13], 11)); // 5


/*
 * Binary Search
 *
 * 1. left = 0, right = n - 1
 * 2. Calculate mid
 * 3. Compare nums[mid] with target
 * 4. Eliminate half of the search space
 *
 * If target is FOUND:
 * - Any occurrence → return immediately
 * - First occurrence → save answer, search LEFT
 * - Last occurrence → save answer, search RIGHT
 *
 * Boundary variations:
 * - Lower Bound → first value >= target
 * - Upper Bound → first value > target
 *
 * Time  : O(log n)
 * Space : O(1)
 */

type SearchMode =
    | "any"
    | "first"
    | "last"
    | "lowerBound"
    | "upperBound";

function binarySearchAdv(
    nums: number[],
    target: number,
    mode: SearchMode = "any"
): number {

    let left = 0;
    let right = nums.length - 1;
    let answer = -1;

    while (left <= right) {

        const mid = Math.floor(
            left + (right - left) / 2
        );

        if (nums[mid]! === target) {

            // Any occurrence
            if (mode === "any") {
                return mid;
            }

            // First occurrence → continue searching left
            if (mode === "first") {
                answer = mid;
                right = mid - 1;
            }

            // Last occurrence → continue searching right
            else if (mode === "last") {
                answer = mid;
                left = mid + 1;
            }

            // Lower/upper bound handled below
            else {
                answer = mid;

                if (mode === "lowerBound") {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }

        } else if (nums[mid]! < target) {
            left = mid + 1;

        } else {
            right = mid - 1;
        }
    }

    return answer;
}

const nums = [1, 2, 2, 2, 3, 4];

binarySearchAdv(nums, 2, "any"); // → 1 or 2 or 3
binarySearchAdv(nums, 2, "first"); // → 1
binarySearchAdv(nums, 2, "last"); // → 3