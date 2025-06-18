import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getMissions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("missions").collect();
  },
});

export const getMission = query({
  args: { missionId: v.id("missions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.missionId);
  },
});

export const addNewMissions = mutation({
  args: {},
  handler: async (ctx) => {
    const newMissions = [
      {
        name: "Face Shield Mission",
        description: "Deploy advanced facial recognition and protection systems to secure critical areas.",
        points: 55,
        isActive: true,
      },
      {
        name: "Cylon Mission",
        description: "Navigate through hostile robotic territories and disable enemy surveillance networks.",
        points: 60,
        isActive: true,
      },
      {
        name: "Web Mission",
        description: "Infiltrate complex web architectures and establish secure communication channels.",
        points: 42,
        isActive: true,
      },
      {
        name: "SOS Mission",
        description: "Respond to emergency distress signals and coordinate rescue operations across the galaxy.",
        points: 48,
        isActive: true,
      },
      {
        name: "Auto Dispenser Mission",
        description: "Optimize automated resource distribution systems for maximum efficiency and reliability.",
        points: 38,
        isActive: true,
      },
      {
        name: "Living Shield Mission",
        description: "Develop and maintain bio-integrated defense systems that adapt to evolving threats.",
        points: 65,
        isActive: true,
      },
    ];

    for (const mission of newMissions) {
      // Check if mission already exists
      const existing = await ctx.db
        .query("missions")
        .filter((q) => q.eq(q.field("name"), mission.name))
        .first();
      
      if (!existing) {
        await ctx.db.insert("missions", mission);
      }
    }
  },
});

export const initializeMissions = mutation({
  args: {},
  handler: async (ctx) => {
    const existingMissions = await ctx.db.query("missions").collect();
    if (existingMissions.length > 0) {
      return; // Already initialized
    }

    const missions = [
      {
        name: "Cyber Mission",
        description: "Complete cybersecurity challenges and protect digital assets from threats.",
        points: 50,
        isActive: true,
      },
      {
        name: "Avatar Mission",
        description: "Customize your avatar and express your unique identity in the digital realm.",
        points: 25,
        isActive: true,
      },
      {
        name: "PR Mission",
        description: "Build your public relations skills and create compelling content.",
        points: 40,
        isActive: true,
      },
      {
        name: "Blinky Mission",
        description: "Master the art of quick reflexes and lightning-fast decision making.",
        points: 35,
        isActive: true,
      },
      {
        name: "Distance Alarm Mission",
        description: "Monitor and manage remote systems with precision and accuracy.",
        points: 45,
        isActive: true,
      },
      {
        name: "Face Shield Mission",
        description: "Deploy advanced facial recognition and protection systems to secure critical areas.",
        points: 55,
        isActive: true,
      },
      {
        name: "Cylon Mission",
        description: "Navigate through hostile robotic territories and disable enemy surveillance networks.",
        points: 60,
        isActive: true,
      },
      {
        name: "Web Mission",
        description: "Infiltrate complex web architectures and establish secure communication channels.",
        points: 42,
        isActive: true,
      },
      {
        name: "SOS Mission",
        description: "Respond to emergency distress signals and coordinate rescue operations across the galaxy.",
        points: 48,
        isActive: true,
      },
      {
        name: "Auto Dispenser Mission",
        description: "Optimize automated resource distribution systems for maximum efficiency and reliability.",
        points: 38,
        isActive: true,
      },
      {
        name: "Living Shield Mission",
        description: "Develop and maintain bio-integrated defense systems that adapt to evolving threats.",
        points: 65,
        isActive: true,
      },
    ];

    for (const mission of missions) {
      await ctx.db.insert("missions", mission);
    }
  },
});
