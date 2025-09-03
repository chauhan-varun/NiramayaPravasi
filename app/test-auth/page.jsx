'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestAuth() {
  const router = useRouter();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [cookies, setCookies] = useState([]);
  
  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(cookie => {
      const parts = cookie.trim().split('=');
      return {
        name: parts[0],
        value: parts.length > 1 ? parts[1] : ''
      };
    });
    
    setCookies(allCookies);
    
    // Try to get the authToken
    const authCookie = allCookies.find(c => c.name === 'authToken');
    if (authCookie) {
      try {
        // We can't decode the JWT on client side without the secret,
        // but we can extract header and payload parts
        const parts = authCookie.value.split('.');
        if (parts.length >= 2) {
          const header = JSON.parse(atob(parts[0]));
          // For payload, handle padding issues in base64url format
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          
          setTokenInfo({ header, payload });
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, []);

  const clearCookies = () => {
    // Clear the authToken cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Reload the page
    window.location.reload();
  };
  
  const testLogin = async () => {
    // Directly set a test token in the cookie for debugging
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
      console.log('Test login response:', result);
      
      if (result.success && result.token) {
        document.cookie = `authToken=${result.token}; path=/; max-age=86400`;
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during test login:', error);
    }
  };
  
  const navigateToDashboard = () => {
    router.push('/admin/super');
  };

  return (
    <div className="container my-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Auth Debugging Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Cookies:</h2>
            {cookies.length === 0 ? (
              <div className="text-red-500">No cookies found</div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
                {cookies.map(cookie => `${cookie.name}: ${cookie.name === 'authToken' ? '[HIDDEN]' : cookie.value}`).join('\n')}
              </pre>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Auth Token Info:</h2>
            {tokenInfo ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
                {JSON.stringify(tokenInfo, null, 2)}
              </pre>
            ) : (
              <div className="text-amber-500">No auth token found or token is invalid</div>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button onClick={testLogin}>Test Login</Button>
            <Button onClick={clearCookies} variant="outline">Clear Cookies</Button>
            {tokenInfo && (
              <Button onClick={navigateToDashboard}>Navigate to Dashboard</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
