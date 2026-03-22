import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Boards table - kanban boards within Clerk organizations
  boards: defineTable({
    // Clerk organization ID
    clerkOrgId: v.string(),
    name: v.string(),
    // Optional description
    description: v.optional(v.string()),
    // Creator's Clerk user ID
    createdBy: v.string(),
    // Board settings/metadata
    isArchived: v.optional(v.boolean()),
  })
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_clerk_org_id_and_created_by", ["clerkOrgId", "createdBy"])
    .index("by_created_by", ["createdBy"]),
});
