import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  players: defineTable({
    name: v.string(),
    password: v.string(),
    teamName: v.string(),
    totalScore: v.number(),
    avatarId: v.optional(v.id("_storage")),
    lastLoginDate: v.optional(v.number()),
    // New profile fields
    realName: v.optional(v.string()),
    gender: v.optional(v.string()),
    hideGender: v.optional(v.boolean()),
    hometown: v.optional(v.string()),
    hideHometown: v.optional(v.boolean()),
    company: v.optional(v.string()),
    occupation: v.optional(v.string()),
    aboutYou: v.optional(v.string()),
    favoriteHobbies: v.optional(v.array(v.string())),
    customHobbies: v.optional(v.string()),
    idCardId: v.optional(v.id("_storage")),
    personalWebsite: v.optional(v.string()),
  })
    .index("by_name", ["name"])
    .index("by_team", ["teamName"]),

  npcs: defineTable({
    name: v.string(),
    realName: v.string(),
    gender: v.optional(v.string()),
    hideGender: v.optional(v.boolean()),
    hometown: v.optional(v.string()),
    hideHometown: v.optional(v.boolean()),
    company: v.optional(v.string()),
    occupation: v.optional(v.string()),
    aboutYou: v.optional(v.string()),
    teamName: v.optional(v.string()),
    favoriteHobbies: v.optional(v.array(v.string())),
    customHobbies: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
  })
    .index("by_name", ["name"])
    .index("by_team", ["teamName"]),

  teams: defineTable({
    name: v.string(),
    memberCount: v.number(),
    totalScore: v.number(),
  })
    .index("by_name", ["name"]),

  missions: defineTable({
    name: v.string(),
    description: v.string(),
    points: v.number(),
    isActive: v.boolean(),
  }),

  achievements: defineTable({
    playerId: v.id("players"),
    missionId: v.optional(v.id("missions")),
    label: v.optional(v.string()),
    points: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    pointsEarned: v.optional(v.number()),
  })
    .index("by_player", ["playerId"])
    .index("by_mission", ["missionId"]),

  messages: defineTable({
    to: v.string(),
    from: v.string(),
    subject: v.string(),
    body: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    sendDate: v.number(),
    messageRead: v.boolean(),
    readDate: v.optional(v.number()),
  })
    .index("by_recipient", ["to"])
    .index("by_priority", ["priority"]),

  admins: defineTable({
    username: v.string(),
    password: v.string(),
    avatarId: v.optional(v.id("_storage")),
    lastLoginDate: v.number(),
  })
    .index("by_username", ["username"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
