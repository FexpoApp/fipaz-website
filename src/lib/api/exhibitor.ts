import { z } from "zod";

import { apiDelete, apiGet, apiPatch, apiPost, apiUpload } from "@/lib/api/http-client";

/** El backend omite estos campos cuando no tienen valor, en vez de mandar `null`. */
const nullableString = () => z.string().nullish().transform((value) => value ?? null);

const companySchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  description: nullableString(),
  logoPath: nullableString(),
  website: nullableString(),
  contactEmail: nullableString(),
});

const standSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  eventId: z.string().uuid(),
  eventName: z.string(),
  boothCode: z.string(),
  displayName: z.string(),
  description: nullableString(),
  logoPath: nullableString(),
  website: nullableString(),
  tags: z.array(z.string()),
  activityHighlight: nullableString(),
  promotionHighlight: nullableString(),
  visitPoints: z.number(),
  status: z.string(),
});

const uploadedFileSchema = z.object({
  id: z.string().uuid(),
  path: z.string(),
  url: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

const kpisSchema = z.object({
  activeStands: z.number(),
  uniqueVisitors: z.number(),
  totalCheckins: z.number(),
  firstVisits: z.number(),
  activityAttendees: z.number(),
  redemptionsValidated: z.number(),
  unitsDelivered: z.number(),
});

const checkinSchema = z.object({
  id: z.string().uuid(),
  standId: z.string().uuid(),
  userId: z.string().uuid(),
  method: z.enum(["nfc", "qr", "manual", "system"]),
  acceptedAt: z.string(),
});

const issuedQrSchema = z.object({
  qrId: z.string().uuid(),
  token: z.string().min(1),
  expiresAt: z.string(),
});

const updatedRecordSchema = z.object({ id: z.string().uuid() }).passthrough();

export type ExhibitorCompany = z.infer<typeof companySchema>;
export type ExhibitorStand = z.infer<typeof standSchema>;
export type UploadedFile = z.infer<typeof uploadedFileSchema>;
export type CompanyKpis = z.infer<typeof kpisSchema>;
export type StandCheckin = z.infer<typeof checkinSchema>;
export type IssuedStandQr = z.infer<typeof issuedQrSchema>;

export const exhibitorApi = {
  async getCompany(companyId: string): Promise<ExhibitorCompany> {
    return companySchema.parse(await apiGet(`/companies/${encodeURIComponent(companyId)}`));
  },
  async getStands(companyId: string): Promise<ExhibitorStand[]> {
    return z.array(standSchema).parse(await apiGet(`/companies/${encodeURIComponent(companyId)}/stands`));
  },
  async getKpis(companyId: string, eventId: string): Promise<CompanyKpis> {
    return kpisSchema.parse(await apiGet(`/companies/${encodeURIComponent(companyId)}/kpis`, { query: { eventId } }));
  },
  async updateCompany(companyId: string, patch: {
    displayName?: string;
    description?: string | null;
    contactEmail?: string | null;
    website?: string | null;
  }): Promise<ExhibitorCompany> {
    return companySchema.parse(await apiPatch(`/companies/${encodeURIComponent(companyId)}`, patch));
  },
  async updateStand(standId: string, patch: {
    displayName?: string;
    description?: string | null;
    tags?: string[];
    activityHighlight?: string | null;
    promotionHighlight?: string | null;
    logoPath?: string | null;
    website?: string | null;
  }): Promise<{ id: string }> {
    return updatedRecordSchema.parse(await apiPatch(`/stands/${encodeURIComponent(standId)}`, patch));
  },
  /** Sube una imagen (PNG/JPEG/WebP, máx. 5 MB) y devuelve su ruta para usar como `logoPath`. */
  async uploadLogo(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append("file", file);
    return uploadedFileSchema.parse(await apiUpload("/uploads", formData));
  },
  async getCheckins(standId: string): Promise<StandCheckin[]> {
    return z.array(checkinSchema).parse(await apiGet(`/stands/${encodeURIComponent(standId)}/check-ins`));
  },
  async issueQr(standId: string, ttlSeconds: number, maxScans: number): Promise<IssuedStandQr> {
    return issuedQrSchema.parse(await apiPost(`/stands/${encodeURIComponent(standId)}/qr`, { ttlSeconds, maxScans }));
  },
  async revokeQr(qrId: string): Promise<void> {
    await apiDelete(`/qr/${encodeURIComponent(qrId)}`);
  },
};
