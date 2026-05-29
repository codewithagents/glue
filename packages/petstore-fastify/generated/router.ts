// This file is auto-generated. Do not edit manually.

import type { FastifyInstance } from "fastify";
import type { CreatePetRequest } from "./models.js";
import type { PetstoreService } from "./service.js";

export function createRouter(
  app: FastifyInstance,
  service: PetstoreService,
): void {
  app.get<{ Querystring: { species?: string } }>(
    "/pets",
    async (req, reply) => {
      const params = {
        species: req.query.species,
      };
      return service.listPets(params);
    },
  );

  app.post<{ Body: CreatePetRequest }>("/pets", async (req, reply) => {
    reply.status(201);
    return service.createPet(req.body);
  });

  app.get<{ Params: { id: string } }>("/pets/:id", async (req, reply) => {
    return service.getPet(req.params.id);
  });

  app.delete<{ Params: { id: string } }>("/pets/:id", async (req, reply) => {
    await service.deletePet(req.params.id);
    reply.status(204).send();
  });
}
