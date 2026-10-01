/**
 * ============================================================================
 * STACK MASTER PATTERNS (LeetCode 20, 496, 739)
 * ============================================================================
 */

// ============================================================================
// 1. VALID PARENTHESES (LeetCode 20)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Matching brackets / nested tags / undo-redo"
 *    - Metaphor: The Cafeteria Tray Dispenser 🍽️ (Last bracket placed on top is FIRST to close).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Push opening brackets `(`, `{`, `[` onto stack.
 *    - Step 2: On closing bracket, pop top of stack and check if it matches pair table.
 *    - Step 3: At the end, ensure `stack.length === 0` (no unclosed brackets remain).
 *
 * 3. THE APPROACH:
 *    - LIFO (Last-In-First-Out) stack + matching pairs lookup table.
 *
 * 4. TRADE-OFFS:
 *    - Stack vs Simple Counter:
 *      * A numeric counter only works if there is 1 bracket type `()`.
 *      * With multiple types `{[()]}`, order matters! A counter cannot detect `"([)]"`, but stack does.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Starting with closing bracket: `"]"` -> popping empty stack returns `undefined`.
 *    - String with only opening brackets: `"((("` -> must check `stack.length === 0` at end!
 *
 * Complexity: Time O(N) | Space O(N)
 */
export function isValid(s: string): boolean {
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
        else if (pairs[char]) {
            if (stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    // Valid only if no unmatched opening brackets remain
    return stack.length === 0;
}

// ============================================================================
// 2. MONOTONIC STACK (LeetCode 496, 739)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Next Greater Element", "Next Smaller Element", "Daily Temperatures"
 *    - Metaphor: The Doctor's Waiting Room 🏥 (Elements sit in stack waiting until someone
 *      arrives that can resolve them. Current element resolves everyone weaker than it).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Maintain stack of INDICES whose answer is not found yet.
 *    - Step 2: For each current element, compare with top of stack:
 *              * If `current` beats `stackTop` -> POP index and record `result[index] = current`.
 *              * Repeat while stack has elements to resolve.
 *    - Step 3: Push current index onto stack.
 *    - Step 4: Unresolved indices retain default `-1`.
 *
 * 3. THE APPROACH:
 *    - Monotonic stack maintains elements in strictly increasing or decreasing order.
 *
 * 4. TRADE-OFFS:
 *    - Brute Force vs Monotonic Stack:
 *      * Brute force: nested loops O(N^2) time.
 *      * Monotonic Stack: O(N) linear time! Each index is pushed and popped at most once.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Storing values instead of indices: we need the index to write answer into `result[index]`.
 *    - Circular array variations (requires running the loop twice: `2 * n`).
 *
 * Complexity: Time O(N) | Space O(N)
 */
export type Direction = "greater" | "smaller";

export function nextElement(
    nums: number[],
    direction: Direction
): number[] {
    const result = new Array<number>(nums.length).fill(-1);
    const stack: number[] = []; // Stores indices

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

// Demo runs
const isDirectRun = process.argv[1]?.endsWith("stack.ts");
if (isDirectRun) {
    console.log("isValid '()[]{}':", isValid("()[]{}")); // true
    console.log("isValid '([)]':", isValid("([)]"));     // false

    const nums = [2, 1, 5, 3, 4];
    console.log("Next Greater:", nextElement(nums, "greater")); // [5, 5, -1, 4, -1]
    console.log("Next Smaller:", nextElement(nums, "smaller")); // [1, -1, 3, -1, -1]
}