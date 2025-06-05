import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  players: defineTable({
    name: v.string(),
    teamName: v.string(),
    password: v.string(),
    avatarId: v.optional(v.id("_storage")),
    totalScore: v.number(),
  }).index("by_name", ["name"]),

  teams: defineTable({
    name: v.string(),
    totalScore: v.number(),
    memberCount: v.number(),
  }).index("by_name", ["name"]),

  achievements: defineTable({
    playerId: v.id("players"),
    label: v.string(),
    points: v.number(),
  }).index("by_player", ["playerId"]),

  missions: defineTable({
    name: v.string(),
    description: v.string(),
    points: v.number(),
    isActive: v.boolean(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
