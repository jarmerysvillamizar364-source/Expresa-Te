/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  AudiovisualResource,
  AudiovisualFilters,
  AudiovisualApiResponse,
} from '../types/audiovisual.ts';
import { INITIAL_AUDIOVISUAL_RESOURCES } from '../data/audiovisualData.ts';

class AudiovisualService {
  private localCache: AudiovisualResource[] = [...INITIAL_AUDIOVISUAL_RESOURCES];

  /**
   * Fetch all audiovisual resources with optional query filters
   */
  async getResources(filters?: AudiovisualFilters): Promise<{
    resources: AudiovisualResource[];
    fromNetwork: boolean;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.format && filters.format !== 'all') params.append('format', filters.format);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/audiovisuales${queryString}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const json: AudiovisualApiResponse<AudiovisualResource[]> = await response.json();
      if (json.success && Array.isArray(json.data)) {
        this.localCache = json.data;
        return { resources: json.data, fromNetwork: true };
      }
      throw new Error('Invalid response structure');
    } catch (err) {
      console.warn('[AudiovisualService] Network request failed, using cached fallback data', err);
      // Filter local cache in fallback mode
      let filtered = [...this.localCache];
      if (filters?.format && filters.format !== 'all') {
        filtered = filtered.filter((r) => r.format === filters.format);
      }
      if (filters?.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase().trim();
        filtered = filtered.filter((r) => {
          if (r.category === cat) return true;
          if (r.tags && r.tags.some((t) => t.toLowerCase() === cat)) return true;

          // Smart category aliases
          if (cat === 'bienestar_emocional' && (r.category === 'emociones' || r.tags.includes('bienestar_emocional') || r.tags.includes('bienestar'))) return true;
          if ((cat === 'ansiedad_estres' || cat === 'estres') && (r.category === 'estres' || r.category === 'ansiedad_estres' || r.tags.includes('estres') || r.tags.includes('ansiedad_estres'))) return true;
          if ((cat === 'comunicacion' || cat === 'comunicacion_asertiva') && (r.category === 'comunicacion' || r.category === 'comunicacion_asertiva' || r.tags.includes('comunicacion') || r.tags.includes('asertividad'))) return true;
          if (cat === 'convivencia' && (r.category === 'convivencia' || r.tags.includes('convivencia') || r.tags.includes('amistad'))) return true;
          if (cat === 'autoestima' && (r.category === 'autoestima' || r.tags.includes('autoestima') || r.tags.includes('amor_propio'))) return true;
          if (cat === 'relaciones' && (r.category === 'relaciones' || r.tags.includes('relaciones') || r.tags.includes('amistad'))) return true;

          return false;
        });
      }
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.author.toLowerCase().includes(q) ||
            r.categoryLabel.toLowerCase().includes(q) ||
            (r.institutionSource && r.institutionSource.toLowerCase().includes(q)) ||
            (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return { resources: filtered, fromNetwork: false };
    }
  }

  /**
   * Get single audiovisual resource by ID
   */
  async getResourceById(id: string): Promise<AudiovisualResource | null> {
    try {
      const response = await fetch(`/api/audiovisuales/${encodeURIComponent(id)}`);
      if (response.ok) {
        const json: AudiovisualApiResponse<AudiovisualResource> = await response.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[AudiovisualService] Falling back to local cache for ID:', id, e);
    }
    return this.localCache.find((r) => r.id === id) || null;
  }

  /**
   * Create a new audiovisual resource (for administrative management)
   */
  async createResource(data: Partial<AudiovisualResource>): Promise<AudiovisualResource> {
    const response = await fetch('/api/audiovisuales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP Error ${response.status}`);
    }

    const json: AudiovisualApiResponse<AudiovisualResource> = await response.json();
    if (!json.success || !json.data) {
      throw new Error('Failed to create resource');
    }
    this.localCache.unshift(json.data);
    return json.data;
  }

  /**
   * Update an existing resource
   */
  async updateResource(id: string, data: Partial<AudiovisualResource>): Promise<AudiovisualResource> {
    const response = await fetch(`/api/audiovisuales/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP Error ${response.status}`);
    }

    const json: AudiovisualApiResponse<AudiovisualResource> = await response.json();
    if (!json.success || !json.data) {
      throw new Error('Failed to update resource');
    }
    const idx = this.localCache.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.localCache[idx] = json.data;
    }
    return json.data;
  }

  /**
   * Delete an existing resource
   */
  async deleteResource(id: string): Promise<boolean> {
    const response = await fetch(`/api/audiovisuales/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP Error ${response.status}`);
    }

    this.localCache = this.localCache.filter((r) => r.id !== id);
    return true;
  }

  /**
   * Normalize and sanitize video embed URLs (especially YouTube links)
   */
  normalizeEmbedUrl(url: string): { embedUrl: string; youtubeId?: string } {
    if (!url) return { embedUrl: '' };

    // YouTube watch URL
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      const id = watchMatch[1];
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        youtubeId: id,
      };
    }

    return { embedUrl: url };
  }
}

export const audiovisualService = new AudiovisualService();
