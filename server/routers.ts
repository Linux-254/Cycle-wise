import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const businesses = [
  { id: "amina", name: "Amina Wholesale", initials: "AW", sector: "Food supply", location: "Eastleigh", offer: "Cooking oil + dry goods", need: "Bookkeeping support", tone: "amber", trust: "8 completed exchanges" },
  { id: "greenpack", name: "GreenPack KE", initials: "GK", sector: "Packaging", location: "Industrial Area", offer: "Food-grade cartons", need: "Courier capacity", tone: "mint", trust: "6 completed exchanges" },
  { id: "swiftmove", name: "SwiftMove Couriers", initials: "SM", sector: "Logistics", location: "Westlands", offer: "Same-day delivery routes", need: "Packaging supply", tone: "blue", trust: "4 completed exchanges" },
  { id: "ledgerpro", name: "LedgerPro Services", initials: "LP", sector: "Business services", location: "Kilimani", offer: "Monthly bookkeeping", need: "Wholesale food stock", tone: "violet", trust: "9 completed exchanges" },
];

const loop = {
  id: "loop-nairobi-041",
  title: "A 4-business supply loop",
  value: 72000,
  fit: 92,
  status: "Ready for review",
  note: "Every business gives one thing and receives one thing. No automatic commitment is made.",
  steps: [
    { from: "Amina Wholesale", item: "Cooking oil + dry goods", to: "LedgerPro Services", value: 18000 },
    { from: "LedgerPro Services", item: "Monthly bookkeeping", to: "GreenPack KE", value: 18000 },
    { from: "GreenPack KE", item: "Food-grade cartons", to: "SwiftMove Couriers", value: 18000 },
    { from: "SwiftMove Couriers", item: "Same-day delivery routes", to: "Amina Wholesale", value: 18000 },
  ],
  checks: [
    { label: "Need / offer fit", value: 96, tone: "mint" },
    { label: "Location fit", value: 88, tone: "blue" },
    { label: "Recorded trust", value: 91, tone: "violet" },
  ],
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workspace: router({
    snapshot: publicProcedure.query(() => ({
      city: "Nairobi",
      networkStatus: "Open network",
      businesses,
      loop,
      activity: [
        { label: "Loop discovered", detail: "4 businesses connected by the local graph", time: "Just now", tone: "mint" },
        { label: "Evidence checked", detail: "17 recorded trust events available", time: "Today", tone: "violet" },
        { label: "Human review needed", detail: "No commitment has been activated", time: "Next", tone: "amber" },
      ],
    })),
    match: publicProcedure.input(z.object({ message: z.string().min(3).max(1200) })).mutation(({ input }) => ({
      ...loop,
      query: input.message,
      generatedAt: new Date().toISOString(),
    })),
  }),
});

export type AppRouter = typeof appRouter;
