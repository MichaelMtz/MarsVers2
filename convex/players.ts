import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createPlayer = mutation({
  args: {
    name: v.string(),
    teamName: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if player name already exists
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingPlayer) {
      throw new Error("Player name already exists");
    }

    // Create or update team
    let team = await ctx.db
      .query("teams")
      .withIndex("by_name", (q) => q.eq("name", args.teamName))
      .first();

    if (team) {
      await ctx.db.patch(team._id, {
        memberCount: team.memberCount + 1,
        totalScore: team.totalScore + 10, // Login bonus
      });
    } else {
      await ctx.db.insert("teams", {
        name: args.teamName,
        totalScore: 10,
        memberCount: 1,
      });
    }

    // Create player
    const playerId = await ctx.db.insert("players", {
      name: args.name,
      teamName: args.teamName,
      password: args.password,
      totalScore: 10, // Login bonus
    });

    // Add login achievement
    await ctx.db.insert("achievements", {
      playerId,
      label: "Welcome Bonus",
      points: 10,
    });

    return playerId;
  },
});

export const loginPlayer = mutation({
  args: {
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (!player || player.password !== args.password) {
      throw new Error("Invalid credentials");
    }

    return player;
  },
});

export const updatePlayer = mutation({
  args: {
    playerId: v.id("players"),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { playerId, ...updates } = args;
    
    // If name is being updated, check for conflicts
    if (updates.name) {
      const existingPlayer = await ctx.db
        .query("players")
        .withIndex("by_name", (q) => q.eq("name", updates.name!))
        .first();

      if (existingPlayer && existingPlayer._id !== playerId) {
        throw new Error("Player name already exists");
      }
    }

    await ctx.db.patch(playerId, updates);
    return await ctx.db.get(playerId);
  },
});

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getPlayerLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    return players
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  },
});

export const getTeamLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  },
});

export const getAllTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getAvatarUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
