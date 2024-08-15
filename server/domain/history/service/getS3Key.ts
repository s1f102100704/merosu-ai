import type { EntityId } from 'api/@types/brandedId';

export const getContentKeyHis = (id: EntityId['history']): string => `works/${id}/content.txt`;
export const getImageKeyHis = (id: EntityId['history']): string => `works/${id}/content.png`;
