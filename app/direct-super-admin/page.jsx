'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import the Super Admin Dashboard component
import SuperAdminDashboard from '../(public)/admin/super/page';

export default function DirectSuperAdmin() {
  const [hasAuthToken, setHasAuthToken] = useState(false);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    // Check if auth token exists
    const cookies = document.cookie.split(';');
    const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    
    if (authTokenCookie) {
      setHasAuthToken(true);
      
      // Try to decode the token (without verification)
      try {
        const token = authTokenCookie.split('=')[1];
        const parts = token.split('.');
        
        if (parts.length === 3) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
          const payload = JSON.parse(atob(padded));
          setTokenData(payload);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'varunrajput6988@gmail.com',
          password: 'rpqi440b3b4D!', 
          role: 'superadmin'
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.token) {
        // Set the token in cookie
        document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        window.location.reload();
      } else {
        alert('Login failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    }
  };

  return (
    <div className="container py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Direct Super Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          {hasAuthToken ? (
            <div>
              <div className="bg-green-100 p-4 mb-4 rounded-md">
                ✅ Auth token found in cookies
                {tokenData && (
                  <div>
                    <p><strong>User ID:</strong> {tokenData.id}</p>
                    <p><strong>Role:</strong> {tokenData.role}</p>
                  </div>
                )}
              </div>
              <p className="mb-4">You can access the Super Admin dashboard below (bypassing middleware)</p>
            </div>
          ) : (
            <div>
              <div className="bg-red-100 p-4 mb-4 rounded-md">
                ❌ No auth token found
              </div>
              <Button onClick={handleLogin}>Login as Super Admin</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {hasAuthToken && tokenData?.role === 'superadmin' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Super Admin Dashboard (Direct Access)</h2>
          <SuperAdminDashboard />
        </div>
      )}
    </div>
  );
}

