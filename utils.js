// ═══════════════════════════════════════════════════════════════════════
// MATH HELPERS — zero allocation, inlined
// ═══════════════════════════════════════════════════════════════════════
/** @param {number} n @returns {number} */
const rnd   = n => Math.random() * n;
/** @param {number} n @returns {number} */
const rndpm = n => (Math.random() - .5) * n * 2;
/** @param {number} n @returns {string} */
const p2    = n => (n < 10 ? '0' : '') + n;
/** @param {number} n @returns {string} */
const p3    = n => (n < 10 ? '00' : n < 100 ? '0' : '') + n;
/** @param {number} t @returns {number} */
const easeIO = t => t < .5 ? 2*t*t : 1 - ((-2*t+2)**2)/2;

