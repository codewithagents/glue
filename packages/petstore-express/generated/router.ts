// This file is auto-generated. Do not edit manually.
// Express: apply express.json() middleware before mounting this router so req.body is populated.

import { Router } from "express";
import type { Request, Response } from "express";
import type { CreatePetRequest } from "./models.js";
import type { PetstoreService } from "./service.js";

export function createRouter(service: PetstoreService): Router {
  const router = Router();

  router.get("/pets", async (req: Request, res: Response) => {
    const params = {
      species: req.query["species"] as string | undefined,
    };
    res.json(await service.listPets(params));
  });

  router.post("/pets", async (req: Request, res: Response) => {
    const body = req.body as CreatePetRequest;
    res.status(201).json(await service.createPet(body));
  });

  router.get("/pets/:id", async (req: Request, res: Response) => {
    res.json(await service.getPet(req.params["id"]!));
  });

  router.delete("/pets/:id", async (req: Request, res: Response) => {
    await service.deletePet(req.params["id"]!);
    res.status(204).end();
  });

  return router;
}
