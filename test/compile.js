import { dirname, resolve } from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';
import RiN from "../lib/index.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

await RiN(resolve(__dirname, "src"), "all", "default", {
    outDir: resolve(__dirname, "dist")
})

exit(1)