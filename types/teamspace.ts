import { OrganizationMembership } from "@clerk/nextjs/server";

export interface Teamspace {
  id: string;
  members: OrganizationMembership[];
}