// This file is auto-generated. Do not edit manually.

import { Hono } from "hono";
import type { CreatePetRequest } from "./models.js";
import type { PetstoreService } from "./service.js";
import { z } from "zod";
import { CreatePetRequestSchema } from "./schemas.js";

export function createRouter(service: PetstoreService): Hono {
  const app = new Hono();

  app.get("/pets", async (c) => {
    const params = {
      species: c.req.query("species") ?? undefined,
    };
    return c.json(await service.listPets(params));
  });

  app.post("/pets", async (c) => {
    const body = await c.req.json<CreatePetRequest>();
    // Validate request body — returns 422 with Zod issues on failure
    const parseResult = CreatePetRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(
        { error: "Invalid request body", issues: parseResult.error.issues },
        422,
      );
    }
    const validatedBody = parseResult.data;
    return c.json(await service.createPet(validatedBody), 201);
  });

  app.get("/pets/:id", async (c) => {
    return c.json(await service.getPet(c.req.param("id")));
  });

  app.delete("/pets/:id", async (c) => {
    await service.deletePet(c.req.param("id"));
    return new Response(null, { status: 204 });
  });

  return app;
}
