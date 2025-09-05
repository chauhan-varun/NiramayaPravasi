// Helper function to get role from token
export function getRoleFromToken(token) {
  try {
    // Basic decode without validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString());
    
    return payload;
  } catch (error) {
    console.log('Decode error');
    return null;
  }
}
