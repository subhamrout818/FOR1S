// Registers the module hooks used by `npm test` (see tests/hooks.mjs).
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
