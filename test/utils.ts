import { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Match objects and returns how far they matches
 * @param expected 
 * @param received 
 * @returns A floating point value indicating how far the objects match
 */
export const matchObjects = (expected: object, received: object): number => Object.keys(expected).reduce((m, k) => expected[k]===received[k]?++m:m, 0) / Object.keys(expected).length

// Loggers ✍
export const headingLog = (msg: string) => console.log('\x1b[1m%s\x1b[0m', "\n" + msg + " 🧪")
export const testLog = (passed: boolean, msg: string, score?: number) => console.log('\x1b[90m%s\x1b[3m%s\x1b[0m', ` ${passed?"✅":"❌"} ${msg}`, "number"==typeof score ? ` (${score}%)` : "")