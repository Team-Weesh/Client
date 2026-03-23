import { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '@/utils';

interface UseAuthReturn {
  isLoggedIn: boolean;
  checkAuthStatus: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = useCallback(() => {
    const hasToken = TokenManager.hasToken();
    const isExpired = TokenManager.isTokenExpired();
    
    const loggedIn = hasToken && !isExpired;
    
    setIsLoggedIn(loggedIn);
    
    if (hasToken && isExpired) {
      TokenManager.removeTokens();
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  return {
    isLoggedIn,
    checkAuthStatus,
  };
};