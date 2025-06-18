import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getAllPlayers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("players").collect();
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
      throw new Error("Invalid name or password");
    }

    // Update last login date
    await ctx.db.patch(player._id, {
      lastLoginDate: Date.now(),
    });

    return player._id;
  },
});

export const createPlayer = mutation({
  args: {
    name: v.string(),
    password: v.string(),
    teamName: v.string(),
    avatarId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Check if name already exists
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingPlayer) {
      throw new Error("Player name already exists");
    }

    const playerId = await ctx.db.insert("players", {
      name: args.name,
      password: args.password,
      teamName: args.teamName,
      totalScore: 0,
      avatarId: args.avatarId,
      lastLoginDate: Date.now(),
    });

    // Update team member count
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("name"), args.teamName))
      .first();

    if (team) {
      await ctx.db.patch(team._id, {
        memberCount: team.memberCount + 1,
      });
    } else {
      // Create new team
      await ctx.db.insert("teams", {
        name: args.teamName,
        memberCount: 1,
        totalScore: 0,
      });
    }

    return playerId;
  },
});

export const updatePlayer = mutation({
  args: {
    playerId: v.id("players"),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
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
  },
  handler: async (ctx, args) => {
    const { playerId, ...updates } = args;
    
    // If updating name, check if it already exists
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

export const getPlayerLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    return players
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

export const getTeamLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  },
});

export const generateUploadUrl = mutation({
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

export const initializePlayers = mutation({
  args: {},
  handler: async (ctx) => {
    const existingPlayers = await ctx.db.query("players").collect();
    if (existingPlayers.length > 0) {
      return; // Already initialized
    }

    // Create sample players
    const samplePlayers = [
      { name: "Alex Chen", teamName: "Alpha Squad", totalScore: 850 },
      { name: "Jordan Smith", teamName: "Beta Team", totalScore: 720 },
      { name: "Sam Rodriguez", teamName: "Alpha Squad", totalScore: 680 },
      { name: "Casey Johnson", teamName: "Gamma Force", totalScore: 590 },
      { name: "Riley Park", teamName: "Beta Team", totalScore: 540 },
    ];

    for (const player of samplePlayers) {
      await ctx.db.insert("players", {
        ...player,
        password: "password123",
        lastLoginDate: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      });
    }

    // Create teams
    const teams = [
      { name: "Alpha Squad", memberCount: 2, totalScore: 1530 },
      { name: "Beta Team", memberCount: 2, totalScore: 1260 },
      { name: "Gamma Force", memberCount: 1, totalScore: 590 },
    ];

    for (const team of teams) {
      await ctx.db.insert("teams", team);
    }
  },
});
