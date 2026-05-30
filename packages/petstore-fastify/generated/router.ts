// This file is auto-generated. Do not edit manually.

import type { FastifyInstance } from "fastify";
import type { CreatePetRequest } from "./models.js";
import type { PetstoreService } from "./service.js";
import { z } from "zod";
import { CreatePetRequestSchema } from "../../petstore-hono/generated/schemas.js";

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
    // Validate request body: returns 422 with Zod issues on failure
    const parseResult = CreatePetRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return reply
        .status(422)
        .send({
          error: "Invalid request body",
          issues: parseResult.error.issues,
        });
    }
    reply.status(201);
    return service.createPet(parseResult.data);
  });

  app.get<{ Params: { id: string } }>("/pets/:id", async (req, reply) => {
    return service.getPet(req.params.id);
  });

  app.delete<{ Params: { id: string } }>("/pets/:id", async (req, reply) => {
    await service.deletePet(req.params.id);
    reply.status(204).send();
  });
}
