'use client';

import { useEffect, useState } from 'react';
import { UserResponse } from '@/domain/models/user/response/user-response';

import { useDI } from '../use-dependency-container';

export function useUserInfo() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { userUsecase } = useDI();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await userUsecase.getUserInfo();
        setUser(result);
      } catch (error) {
        console.error('Failed to load user info', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
}
