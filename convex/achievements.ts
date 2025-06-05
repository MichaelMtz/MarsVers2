import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getPlayerAchievements = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
  },
});

export const addAchievement = mutation({
  args: {
    playerId: v.id("players"),
    label: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    // Add achievement
    await ctx.db.insert("achievements", {
      playerId: args.playerId,
      label: args.label,
      points: args.points,
    });

    // Update player score
    const player = await ctx.db.get(args.playerId);
    if (player) {
      await ctx.db.patch(args.playerId, {
        totalScore: player.totalScore + args.points,
      });

      // Update team score
      const team = await ctx.db
        .query("teams")
        .withIndex("by_name", (q) => q.eq("name", player.teamName))
        .first();

      if (team) {
        await ctx.db.patch(team._id, {
          totalScore: team.totalScore + args.points,
        });
      }
    }

    return args.playerId;
  },
});
