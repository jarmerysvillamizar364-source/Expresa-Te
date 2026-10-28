/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AudiovisualCategory =
  | 'salud_mental'
  | 'autocuidado'
  | 'autoestima'
  | 'emociones'
  | 'relaciones'
  | 'convivencia'
  | 'acoso'
  | 'orientacion'
  | 'estres'
  | 'conflictos'
  | 'comunicacion';

export type AudiovisualFormat = 'video' | 'presentacion' | 'infografia' | 'audio';

export interface AudiovisualResource {
  id: string;
  title: string;
  category: AudiovisualCategory;
  categoryLabel: string;
  format: AudiovisualFormat;
  duration: string;
  thumbnail: string;
  mediaUrl: string;
  youtubeId?: string;
  author: string;
  institutionSource?: string;
  audioLanguage?: string;
  hasSubtitles?: boolean;
  pedagogicalGoal?: string;
  description: string;
  takeaways: string[];
  transcript?: string;
  slides?: Array<{ title: string; content: string; keyIdea: string }>;
  isRecommended?: boolean;
  isDemo?: boolean;
  publishedAt: string;
  tags: string[];
}

export interface AudiovisualFilters {
  search?: string;
  category?: AudiovisualCategory | 'all';
  format?: AudiovisualFormat | 'all';
}

export interface AudiovisualApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  error?: string;
}
