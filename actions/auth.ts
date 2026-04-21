'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function loginAdminAction(email: string, password: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
  
    if (!response.ok) {
      return { success: false, error: data.message || 'Login failed.' };
    }

    const accessToken = data.data.tokens.accessToken;
    const userData = data.data.user; 


    const isAdmin = userData.isAdmin;

    if (!isAdmin) {
      return { success: false, error: 'Access Denied: You are not allowed to access the admin panel.' };
    }

    // Agar Admin hai, tabhi cookies banengi
    const cookieStore = await cookies();

    // 1. Token save karein (Secure/HTTP-only)
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // 2. User Data ko stringify kar ke save karein
    cookieStore.set('admin_user', JSON.stringify(userData), {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true };

  } catch (error) {
    console.error('Login Action Error:', error);
    return { success: false, error: 'Server error. Please try again later.' };
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  // Dono cookies delete karein
  cookieStore.delete('accessToken');
  cookieStore.delete('admin_user'); 
  redirect('/login');
}

// ✅ Naya Action: Header ke liye sirf Cookie se data nikalne ka function (No API Call!)
export async function getLocalAdminUserAction() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('admin_user')?.value;
  
  if (userCookie) {
    return JSON.parse(userCookie);
  }
  return null;
}