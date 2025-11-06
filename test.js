import { startAgent } from "./index.js";

const TOPIC = "The story of a farmer and his golden egg laying goose.";
const MAX_WORDS = 1000;

const response = await startAgent(TOPIC, MAX_WORDS);

console.log("SCRIPT:\n", response.script);