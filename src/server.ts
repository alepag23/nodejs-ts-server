import { type Express } from "express";
import { createApp } from "./app.ts";

const PORT: number = Number(process.env.PORT) || 3000;
const app: Express = createApp();

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});