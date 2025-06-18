import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAllNpcs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("npcs").collect();
  },
});

export const getNpc = query({
  args: { npcId: v.id("npcs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.npcId);
  },
});

export const createNpc = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const npcId = await ctx.db.insert("npcs", {
      name: args.name,
      realName: args.realName,
      gender: args.gender,
      hideGender: args.hideGender,
      hometown: args.hometown,
      hideHometown: args.hideHometown,
      company: args.company,
      occupation: args.occupation,
      aboutYou: args.aboutYou,
      teamName: args.teamName,
      favoriteHobbies: args.favoriteHobbies,
      customHobbies: args.customHobbies,
      avatarId: args.avatarId,
    });
    return npcId;
  },
});

export const updateNpc = mutation({
  args: {
    npcId: v.id("npcs"),
    name: v.optional(v.string()),
    realName: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const { npcId, ...updates } = args;
    await ctx.db.patch(npcId, updates);
    return await ctx.db.get(npcId);
  },
});

export const deleteNpc = mutation({
  args: { npcId: v.id("npcs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.npcId);
  },
});

export const getAvatarUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
