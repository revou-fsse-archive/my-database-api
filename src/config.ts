import * as dotenv from "dotenv";

dotenv.config();

export const EXPRESS_PORT = process.env.EXPRESS_PORT || "8080";
