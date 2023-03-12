import { PrismaClient } from "@prisma/client";
import express from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function buildProductRoute({
    prismaClient,
}: {
    prismaClient: PrismaClient;
}): express.Router {
    const router = express.Router();

    router.post("/", async (req, res, next) => {
        const product = await prismaClient.product.create({
            data: {
                sellerId: req.body["sellerId"],
                name: req.body["name"],
                price: req.body["price"],
                note: req.body["note"],
            },
        });

        res.json(product);
        next();
    });

    router.get("/", async (req, res, next) => {
        const products = await prismaClient.product.findMany();
        res.json(products);
        next();
    });

    router.put("/:id", async (req, res, next) => {
        try {
            const product = await prismaClient.product.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    name: req.body["name"],
                    price: req.body["price"],
                    note: req.body["note"],
                },
            });

            res.json(product);
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code == "P2025"
            ) {
                res.statusCode = 404;
                res.json("product doesn't exists");
            } else {
                throw e;
            }
        }
        next();
    });

    return router;
}
