import express from "express";
import type { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function buildSellerRoute({
    prismaClient,
}: {
    prismaClient: PrismaClient;
}): express.Router {
    const router = express.Router();

    router.get("/", async (req, res, next) => {
        res.json(await prismaClient.seller.findMany());
        next();
    });

    router.post("/", async (req, res, next) => {
        try {
            const seller = await prismaClient.seller.create({
                data: {
                    name: req.body["name"],
                    email: req.body["email"],
                },
            });
            res.json(seller);
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code == "P2002"
            ) {
                res.statusCode = 400;
                res.json("email already exists");
            } else {
                throw e;
            }
        }

        next();
    });

    router.delete("/:id", async (req, res, next) => {
        try {
            const seller = await prismaClient.seller.delete({
                where: {
                    id: req.params.id,
                },
            });

            res.json(seller);
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code == "P2025"
            ) {
                res.statusCode = 404;
                res.json("seller doesn't exists");
            } else {
                throw e;
            }
        }

        next();
    });

    router.get("/:id/products", async (req, res, next) => {
        const seller = await prismaClient.seller.findFirst({
            where: {
                id: req.params.id,
            },
            include: {
                products: true,
            },
        });

        if (!seller) {
            res.statusCode = 404;
            res.json(null);
            return;
        }

        res.json(seller.products);
        next();
    });

    return router;
}
