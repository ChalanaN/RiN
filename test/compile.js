import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import RiN from "../lib/index.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

await RiN(resolve(__dirname, "src"), "all", "default", {
    outDir: resolve(__dirname, "dist"),
    title: "RiN"
})