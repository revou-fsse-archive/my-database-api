import "express-async-errors";
import express from "express";
import { PORT } from "./config";
import { PrismaClient } from "@prisma/client";
import { buildSellerRoute } from "./routes/seller";
import { buildProductRoute } from "./routes/product";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use("/sellers", buildSellerRoute({ prismaClient }));
app.use("/products", buildProductRoute({ prismaClient }));

app.listen(PORT, () =>
    console.log(`listening at 0.0.0.0:${PORT}`)
);
