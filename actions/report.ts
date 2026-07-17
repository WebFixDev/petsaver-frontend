'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

export interface GetReportsParams {
  type?: 'user' | 'video' | 'comment' | 'message' | 'sound';
  status?: 'pending' | 'reviewed' | 'resolved';
  reason?: string;
  page?: number;
  limit?: number;
}

export interface ReportItem {
  _id: string;
  reporterId: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
    profileImage?: string;
  };
  reportedId: string;
  type: 'user' | 'video' | 'comment' | 'message' | 'sound';
  reason: string;
  description?: string;
  evidence?: string[];
  status: 'pending' | 'reviewed' | 'resolved';
  actionTaken?: 'warning' | 'removed' | 'banned' | 'no_action';
  reviewedBy?: {
    _id: string;
    username: string;
    fullName: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReportsResponse {
  success: boolean;
  data?: {
    reports: ReportItem[];
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

export interface GetReportDetailResponse {
  success: boolean;
  data?: {
    report: ReportItem & {
      reportedItem: any; // User or Video or Comment object populated from backend
    };
  };
  message?: string;
  error?: string;
}

export interface UpdateReportResponse {
  success: boolean;
  data?: {
    report: ReportItem;
  };
  message?: string;
  error?: string;
}

/**
 * Fetch all reports with filters
 */
export async function getReportsAction(params: GetReportsParams = {}): Promise<GetReportsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.set('type', params.type);
    if (params.status) queryParams.set('status', params.status);
    if (params.reason) queryParams.set('reason', params.reason);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());

    const url = `${BASE_URL}${API_PREFIX}/reports?${queryParams.toString()}`;

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
        error: data.message || 'Failed to fetch reports',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('getReportsAction error:', error);
    return {
      success: false,
      error: 'Server error while fetching reports.',
    };
  }
}

/**
 * Fetch a single report by its ID
 */
export async function getReportByIdAction(reportId: string): Promise<GetReportDetailResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const url = `${BASE_URL}${API_PREFIX}/reports/${reportId}`;

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
        error: data.message || 'Failed to fetch report details',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('getReportByIdAction error:', error);
    return {
      success: false,
      error: 'Server error while fetching report details.',
    };
  }
}

/**
 * Update report status / take action on a report
 */
export async function updateReportStatusAction(
  reportId: string,
  params: {
    status?: 'pending' | 'reviewed' | 'resolved';
    actionTaken?: 'warning' | 'removed' | 'banned' | 'no_action';
  }
): Promise<UpdateReportResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const url = `${BASE_URL}${API_PREFIX}/reports/${reportId}/status`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect('/login');
      }
      return {
        success: false,
        error: data.message || 'Failed to update report status',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error('updateReportStatusAction error:', error);
    return {
      success: false,
      error: 'Server error while updating report status.',
    };
  }
}
