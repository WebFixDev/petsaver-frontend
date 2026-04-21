// app/actions/video-actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

export interface GetUserVideosParams {
  page?: number;
  limit?: number;
  type?: 'all' | 'liked';  // 'all' = uploaded videos, 'liked' = liked videos
}

export interface Video {
  _id: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  privacy: 'public' | 'friends' | 'private';
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
  userId: {
    _id: string;
    username: string;
    profileImage?: string;
    verified?: boolean;
  };
  isLiked?: boolean;
}

interface GetUserVideosResponse {
  success: boolean;
  data?: {
    videos: Video[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  message?: string;
  error?: string;
  isUnauthorized?: boolean;
}

/**
 * Fetch videos for a specific user (admin or public view)
 * Calls GET /api/v1/user/:userId
 */
export async function getUserVideosAction(
  userId: string,
  params: GetUserVideosParams = {}
): Promise<GetUserVideosResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value; // Use 'admin_token' if different

  if (!token) {
    redirect('/login');
  }

  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.type && params.type !== 'all') queryParams.set('type', params.type);

    const url = `${BASE_URL}${API_PREFIX}/videos/user/${userId}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401/403 by redirecting to login
      if (response.status === 401 || response.status === 403) {
        redirect('/login');
      }
      return {
        success: false,
        error: data.message || 'Failed to fetch user videos',
      };
    }

    // Expected backend response: ApiResponse { success: true, data: { videos, pagination } }
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('getUserVideosAction error:', error);
    return {
      success: false,
      error: 'Server error. Please try again later.',
    };
  }
}

/**
 * Delete a video (soft delete)
 * Calls DELETE /api/v1/videos/:videoId
 */
export async function deleteVideoAction(videoId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const url = `${BASE_URL}${API_PREFIX}/videos/admin/${videoId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect('/login');
      }
      return {
        success: false,
        error: data.message || 'Failed to delete video',
      };
    }

    return {
      success: true,
      message: data.message || 'Video deleted successfully',
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('deleteVideoAction error:', error);
    return {
      success: false,
      error: 'Server error while deleting video.',
    };
  }
}



interface GetAllVideosParams {
  page?: number;
  limit?: number;
  search?: string;          // caption ya username ke hisaab se
  status?: string;          // published, draft, processing, failed
  privacy?: string;         // public, friends, private
  sortBy?: string;          // createdAt, views, likes
  sortOrder?: 'asc' | 'desc';
}

interface GetAllVideosResponse {
  success: boolean;
  data?: {
    videos: any[];
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

export async function getAllVideosAction(params: GetAllVideosParams = {}): Promise<GetAllVideosResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value; // ya 'admin_token'

  if (!token) {
    redirect('/login');
  }

  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    if (params.privacy) queryParams.set('privacy', params.privacy);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const url = `${BASE_URL}${API_PREFIX}/videos/all?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect('/login');
      }
      return {
        success: false,
        error: data.message || 'Failed to fetch videos',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('getAllVideosAction error:', error);
    return {
      success: false,
      error: 'Server error. Please try again later.',
    };
  }
}