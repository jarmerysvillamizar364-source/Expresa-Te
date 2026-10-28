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
        filtered = filtered.filter((r) => r.category === filters.category);
      }
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.author.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
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
