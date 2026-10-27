import { z } from "zod";

import { apiGet } from "@/lib/api/http-client";

export const accessibleEventSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  status: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  venueName: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  countryCode: z.string().optional(),
  bannerPath: z.string().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  isCurrentActive: z.boolean().optional(),
  isSimulated: z.boolean().optional(),
});

export type AccessibleEvent = z.infer<typeof accessibleEventSchema>;

export async function getAccessibleEvents(): Promise<AccessibleEvent[]> {
  return z.array(accessibleEventSchema).parse(await apiGet("/events"));
}

export async function getEventById(eventId: string): Promise<AccessibleEvent> {
  return accessibleEventSchema.parse(await apiGet(`/events/${encodeURIComponent(eventId)}`));
}

