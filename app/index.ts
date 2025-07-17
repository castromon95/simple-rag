import "dotenv/config";
import { App } from "./classes/app.ts";

const app = new App();
await app.start();
