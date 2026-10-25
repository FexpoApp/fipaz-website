import { getStandById as getApiStand, listStands as listApiStands } from "@/lib/api/stands";
import type { ListStandsQueryDto, StandResponseDto } from "@/types/stands-api";

/**
 * Adaptador del directorio protegido. `/panel` siempre consulta el backend con el evento
 * resuelto por la sesión; los fixtures pertenecen exclusivamente a `/demo`.
 */
export type PanelStand = StandResponseDto;

export function listStands(eventId: string, query: ListStandsQueryDto = {}) {
  return listApiStands(eventId, query);
}

export function getStandById(id: string): Promise<PanelStand> {
  return getApiStand(id);
}
