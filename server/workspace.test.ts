import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext;

describe("workspace procedures", () => {
  it("returns a populated Nairobi network snapshot", async () => {
    const result = await appRouter.createCaller(ctx).workspace.snapshot();
    expect(result.city).toBe("Nairobi");
    expect(result.businesses).toHaveLength(4);
    expect(result.loop.fit).toBeGreaterThan(80);
    expect(result.activity).toHaveLength(3);
  });

  it("returns a grounded loop for a user request", async () => {
    const message = "I have cartons and need courier capacity in Industrial Area";
    const result = await appRouter.createCaller(ctx).workspace.match({ message });
    expect(result.query).toBe(message);
    expect(result.steps).toHaveLength(4);
    expect(result.steps.every((step) => step.from && step.to && step.item)).toBe(true);
    expect(result.generatedAt).toBeTruthy();
  });
});
