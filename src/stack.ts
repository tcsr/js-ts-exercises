function isValid(s: string): boolean {
    const stack: string[] = [];

    const pairs: Record<string, string> = {
        ")": "(",
        "}": "{",
        "]": "["
    };

    for (const char of s) {

        // Opening bracket → push
        if (char === "(" || char === "{" || char === "[") {
            stack.push(char);
        }

        // Closing bracket → check top
        else {
            if (stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    // Valid only if no unmatched opening brackets remain
    return stack.length === 0;
}


//2. Monotonic Stack, Pattern: Increasing Stack → values increase from bottom → top, Decreasing Stack → values decrease from bottom → top
// Most common use:Next Greater Element / Next Smaller Element, Nearest greater/smaller, Previous greater/smaller etc.

/*
 * Monotonic Stack — Next Greater / Smaller
 *
 * 1. Maintain a stack of indexes whose answer is not found yet.
 * 2. For each current element, compare it with the stack top.
 * 3. Next Greater → current > stackTop → POP and set answer.
 * 4. Next Smaller → current < stackTop → POP and set answer.
 * 5. Continue POP while the current element resolves stack elements.
 * 6. Push the current index into the stack.
 * 7. Remaining indexes have no matching greater/smaller element → -1.
 *
 * Time  : O(n) — each index is pushed and popped at most once.
 * Space : O(n) — stack + result.
 */

type Direction = "greater" | "smaller";

function nextElement(
    nums: number[],
    direction: Direction
): number[] {

    const result = new Array<number>(nums.length).fill(-1);
    const stack: number[] = [];

    for (let i = 0; i < nums.length; i++) {

        const current = nums[i]!;

        while (stack.length > 0) {

            const topIndex = stack[stack.length - 1]!;
            const topValue = nums[topIndex]!;

            const shouldPop =
                direction === "greater"
                    ? current > topValue
                    : current < topValue;

            if (!shouldPop) {
                break;
            }

            const index = stack.pop()!;
            result[index] = current;
        }

        stack.push(i);
    }

    return result;
}

const nums = [2, 1, 5, 3, 4];

console.log(nextElement(nums, "greater"));
// [5, 5, -1, 4, -1]

console.log(nextElement(nums, "smaller"));
// [1, -1, 3, -1, -1]