import { resolve } from "path";
import RiN from "../src";

// Make this work 😐
RiN(resolve(__dirname, "src"), "all", "default", {
    outDir: resolve(__dirname, "dist")
})