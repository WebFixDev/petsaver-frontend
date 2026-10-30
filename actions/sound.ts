'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

export interface SoundItem {
  _id: string;
  name: string;
  audioUrl: string;
  duration: number;
  artist?: string;
  thumbnail?: string;
  category: 'music' | 'voice' | 'effect' | 'nature' | 'animal';
  genre?: string;
  description?: string;
  tags?: string[];
  usesCount: number;
  isTrending: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface GetSoundsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isTrending?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface GetSoundsResponse {
  success: boolean;
  data?: {
    sounds: SoundItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  message?: string;
  error?: string;
}

/**
 * Fetch sounds / music tracks with filtering & pagination
 */
export async function getSoundsAction(params: GetSoundsParams = {}): Promise<GetSoundsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.category && params.category !== 'all') queryParams.set('category', params.category);
    if (params.isTrending !== undefined) queryParams.set('isTrending', String(params.isTrending));
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const res = await fetch(`${BASE_URL}${API_PREFIX}/sounds?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (res.status === 401) {
      redirect('/login');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching sounds:', error);
    return {
      success: false,
      error: error?.message || 'Failed to fetch sounds',
    };
  }
}

/**
 * Upload new sound / music track
 */
export async function uploadSoundAction(formData: FormData): Promise<{
  success: boolean;
  message?: string;
  data?: SoundItem;
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/sounds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401) {
      redirect('/login');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error uploading sound:', error);
    return {
      success: false,
      error: error?.message || 'Failed to upload sound',
    };
  }
}

/**
 * Delete a sound
 */
export async function deleteSoundAction(soundId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/sounds/${soundId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      redirect('/login');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error deleting sound:', error);
    return {
      success: false,
      error: error?.message || 'Failed to delete sound',
    };
  }
}

/**
 * Toggle trending status for a sound
 */
export async function toggleTrendingSoundAction(soundId: string): Promise<{
  success: boolean;
  message?: string;
  data?: SoundItem;
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/sounds/${soundId}/trending`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      redirect('/login');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Error toggling trending sound:', error);
    return {
      success: false,
      error: error?.message || 'Failed to toggle trending sound',
    };
  }
}
