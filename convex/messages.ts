import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

export const getMessagesByRecipient = query({
  args: { to: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("to", args.to))
      .order("desc")
      .collect();
  },
});

export const getMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const createMessage = mutation({
  args: {
    to: v.string(),
    from: v.string(),
    subject: v.string(),
    body: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      to: args.to,
      from: args.from,
      subject: args.subject,
      body: args.body,
      sendDate: Date.now(),
      priority: args.priority,
      messageRead: false,
    });
    return messageId;
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    to: v.optional(v.string()),
    from: v.optional(v.string()),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    messageRead: v.optional(v.boolean()),
    readDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { messageId, ...updates } = args;
    await ctx.db.patch(messageId, updates);
    return await ctx.db.get(messageId);
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

export const markMessageAsRead = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      messageRead: true,
      readDate: Date.now(),
    });
  },
});

export const initializeMessages = mutation({
  args: {},
  handler: async (ctx) => {
    const existingMessages = await ctx.db.query("messages").collect();
    if (existingMessages.length > 0) {
      return; // Already initialized
    }

    const sampleMessages = [
      {
        to: "all",
        from: "System",
        subject: "Welcome to the Space Dashboard",
        body: "Welcome to your new space mission dashboard! Check out the available missions and start earning points.",
        sendDate: Date.now() - 86400000, // 1 day ago
        priority: "medium" as const,
        messageRead: false,
      },
      {
        to: "all",
        from: "Mission Control",
        subject: "New Missions Available",
        body: "Several new high-priority missions have been added to the system. Check the mission list for details.",
        sendDate: Date.now() - 43200000, // 12 hours ago
        priority: "high" as const,
        messageRead: false,
      },
      {
        to: "all",
        from: "Admin",
        subject: "System Maintenance Notice",
        body: "Scheduled maintenance will occur this weekend. All missions will remain active during this time.",
        sendDate: Date.now() - 21600000, // 6 hours ago
        priority: "low" as const,
        messageRead: false,
      },
    ];

    for (const message of sampleMessages) {
      await ctx.db.insert("messages", message);
    }
  },
});
