import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new board
export const createBoard = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const boardId = await ctx.db.insert("boards", {
      clerkOrgId: args.clerkOrgId,
      name: args.name,
      description: args.description,
      createdBy: identity.tokenIdentifier,
      isArchived: false,
    });

    return boardId;
  },
});

// Get boards for a Clerk organization
export const getOrganizationBoards = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const boards = await ctx.db
      .query("boards")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return boards;
  },
});

// Get all boards for the current user
export const getUserBoards = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const boards = await ctx.db
      .query("boards")
      .withIndex("by_created_by", (q) => q.eq("createdBy", identity.tokenIdentifier))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return boards;
  },
});

// Get a single board
export const getBoard = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      return null;
    }

    // For now, allow access if user created it or is in the same org
    // In a real app, you'd check Clerk org membership
    return board;
  },
});

// Update board
export const updateBoard = mutation({
  args: {
    boardId: v.id("boards"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // For now, only allow the creator to update
    // In a real app, you'd check Clerk org membership and roles
    if (board.createdBy !== identity.tokenIdentifier) {
      throw new Error("Not authorized to update this board");
    }

    const updates: Partial<Pick<typeof board, "name" | "description">> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.boardId, updates);
  },
});

// Delete board (actually archive it)
export const deleteBoard = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // For now, only allow the creator to delete
    // In a real app, you'd check Clerk org membership and roles
    if (board.createdBy !== identity.tokenIdentifier) {
      throw new Error("Not authorized to delete this board");
    }

    // Archive the board instead of deleting
    await ctx.db.patch(args.boardId, { isArchived: true });
  },
});