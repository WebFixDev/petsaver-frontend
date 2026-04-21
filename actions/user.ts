// app/actions/admin-actions.ts (or your chosen actions file)
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_PREFIX = '/api/v1';

interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  isBanned?: boolean;
  role?: string;
}

interface GetAllUsersResponse {
  success: boolean;
  data?: {
    users: any[];
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


export async function getAllUsersAction(params: GetAllUsersParams = {}): Promise<GetAllUsersResponse> {
  // 1. Token Check try..catch se bahar nikalen taake redirect properly kaam kare
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
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    if (params.isActive !== undefined) queryParams.set('isActive', params.isActive.toString());
    if (params.isBanned !== undefined) queryParams.set('isBanned', params.isBanned.toString());
    if (params.role) queryParams.set('role', params.role);

    // 2. URL Fix: '/users/all-users' (Express routing ke mutabiq)
    const url = `${BASE_URL}${API_PREFIX}/users/all-users?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch users',
        // Hum client ko bata rahe hain ke token expire ho gaya hai, client side redirect karega
        isUnauthorized: response.status === 401 || response.status === 403 
      } as any; 
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    // 3. Agar fetch ke doraan redirect trigger hota hai, toh usay swallow nahi karna
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error('getAllUsersAction error:', error);
    return {
      success: false,
      error: 'Server error. Please try again later.',
    };
  }
}



export async function getUserByIdAction(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (!token) {
      redirect('/login');
    }


    const response = await fetch(`${BASE_URL}${API_PREFIX}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch user details',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('getUserByIdAction error:', error);
    return { success: false, error: 'Server error while fetching user details.' };
  }
}