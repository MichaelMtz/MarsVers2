import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAdmin = query({
  args: { adminId: v.id("admins") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.adminId);
  },
});

export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("admins").collect();
  },
});

export const loginAdmin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!admin || admin.password !== args.password) {
      throw new Error("Invalid username or password");
    }

    // Update last login date
    await ctx.db.patch(admin._id, {
      lastLoginDate: Date.now(),
    });

    return admin._id;
  },
});

export const createAdmin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    avatarId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingAdmin) {
      throw new Error("Username already exists");
    }

    const adminId = await ctx.db.insert("admins", {
      username: args.username,
      password: args.password,
      avatarId: args.avatarId,
      lastLoginDate: Date.now(),
    });

    return adminId;
  },
});

export const updateAdmin = mutation({
  args: {
    adminId: v.id("admins"),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { adminId, ...updates } = args;
    
    // If updating username, check if it already exists
    if (updates.username) {
      const existingAdmin = await ctx.db
        .query("admins")
        .withIndex("by_username", (q) => q.eq("username", updates.username!))
        .first();

      if (existingAdmin && existingAdmin._id !== adminId) {
        throw new Error("Username already exists");
      }
    }

    await ctx.db.patch(adminId, updates);
    return await ctx.db.get(adminId);
  },
});

export const deleteAdmin = mutation({
  args: { adminId: v.id("admins") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.adminId);
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

export const updateMission = mutation({
  args: {
    missionId: v.id("missions"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    points: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { missionId, ...updates } = args;
    await ctx.db.patch(missionId, updates);
    return await ctx.db.get(missionId);
  },
});

export const createMission = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    points: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const missionId = await ctx.db.insert("missions", {
      name: args.name,
      description: args.description,
      points: args.points,
      isActive: args.isActive,
    });
    return missionId;
  },
});

export const deletePlayer = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.playerId);
  },
});

export const initializeAdmins = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAdmins = await ctx.db.query("admins").collect();
    if (existingAdmins.length > 0) {
      return; // Already initialized
    }

    // Create default admin user
    await ctx.db.insert("admins", {
      username: "admin",
      password: "admin123",
      lastLoginDate: Date.now(),
    });
  },
});
