// Debounce

const debounce = (fn: Function, delay: number) => {
    let timer: any;

    return (...args: any[]) => {

        clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args);
        }, delay)

    };
}


// Throttle: Throttle allows a function to execute at most once during a specified time interval.
// Ex: "Continuous scrolling?" -> Think → Throttle

const throttle = (fn: Function, delay: number) => {

    let lastCall = 0;

    return ((...args: any[]) => {

        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }

    })
}

const handleScroll = throttle(() => {
    console.log("Scroll handled at", Date.now());
}, 1000)

// if (typeof window !== 'undefined') {
//     window.addEventListener('scroll', handleScroll);
// } else {
//     // Node cave have no window! Simulate scroll:
//     console.log("Node cave: simulating fast scrolls...");
//     let ticks = 0;
//     const interval = setInterval(() => {
//         handleScroll();
//         ticks++;
//         if (ticks > 15) clearInterval(interval);
//     }, 200);
// }

//

// Promise.all vs Promise.allSettled
// Promise.all() -> Use when all operations need to succeed. Promise.all = ALL must succeed

// 1. Problem in your code: .then(res => console.log(res)) return UNDEFINED!
// So results was [undefined, undefined, undefined].
// Must RETURN the value/error!

// OPTIMIZATION 1: Reusable Safe Wrapper for Promise.all
// Turn any wild promise into safe tame rock: { status, value } or { status, reason }
const safe = <T>(promise: Promise<T>) =>
    promise
        .then(value => ({ status: 'fulfilled' as const, value }))
        .catch(reason => ({ status: 'rejected' as const, reason }));

const promises = [
    Promise.resolve("A"),
    Promise.reject("B Rejected"),
    Promise.resolve("C")
];

// All promises wrapped -> Promise.all NEVER explodes!
const safeResults = await Promise.all(promises.map(safe));
console.log('Promise.all + Safe wrapper:', safeResults);

// OPTIMIZATION 2: Native Promise.allSettled (JavaScript built-in magic rock)
// No wrapper needed! Does exact same thing out of the box:
const settledResults = await Promise.allSettled(promises);
console.log('Promise.allSettled:', settledResults);


// ============================================================================
// REAL-WORLD EXAMPLES & DIFFERENCES
// ============================================================================

// ----------------------------------------------------------------------------
// EXAMPLE 1: Promise.all -> "All or Die" (Dependent Tasks)
// If one fails, whole thing aborts immediately! Good for transactional flows.
// ----------------------------------------------------------------------------
console.log("\n--- Scenario 1: Promise.all (All or Die) ---");

const fetchUser = () => Promise.resolve({ id: 1, name: "Caveman Bob" });
const fetchCart = () => Promise.reject(new Error("Cart broken / Out of stock!"));

try {
    // Both user AND cart needed. If cart fails, stop everything!
    const [user, cart] = await Promise.all([fetchUser(), fetchCart()]);
    console.log("Success:", user, cart);
} catch (error: any) {
    console.log("Promise.all caught failure early:", error.message);
}


// ----------------------------------------------------------------------------
// EXAMPLE 2: Promise.allSettled -> "Count Every Body" (Independent Tasks)
// Waits for every task, never explodes. Good for dashboards / independent widgets.
// ----------------------------------------------------------------------------
console.log("\n--- Scenario 2: Promise.allSettled (Independent Widgets) ---");

const getWeather = () => Promise.resolve("Sunny, 25°C");
const getSticksPrice = () => Promise.reject(new Error("Stick market crashed!"));
const getSignals = () => Promise.resolve("3 unread smoke signals");

const dashboardResults = await Promise.allSettled([
    getWeather(),
    getSticksPrice(),
    getSignals()
]);

dashboardResults.forEach((res, index) => {
    if (res.status === 'fulfilled') {
        console.log(`Widget ${index + 1} SUCCESS ->`, res.value);
    } else {
        console.log(`Widget ${index + 1} FAILED  ->`, res.reason.message);
    }
});

