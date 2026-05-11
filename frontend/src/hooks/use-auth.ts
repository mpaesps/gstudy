'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearAuthSession, getStoredUser } from '@/services/api';
import { Role, UserProfile } from '@/types/domain';

const homeByRole: Record<Role, string> = {
  STUDENT: '/dashboard/aluno',
  TUTOR: '/dashboard/tutor',
  COORDINATOR: '/dashboard/coordenacao',
  ADMIN: '/dashboard/coordenacao',
};

export function getHomeByRole(role: Role) {
  return homeByRole[role];
}

export function useAuth(allowedRoles?: Role[]) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('gstudy.token');
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        const response = await api.get<UserProfile>('/auth/me');
        localStorage.setItem('gstudy.user', JSON.stringify(response.data));
        setUser(response.data);

        if (allowedRoles?.length && !allowedRoles.includes(response.data.role)) {
          router.replace(getHomeByRole(response.data.role));
          return;
        }
      } catch {
        clearAuthSession();
        router.replace('/');
        return;
      } finally {
        setLoading(false);
      }
    }

    const stored = getStoredUser<UserProfile>();
    if (stored) {
      setUser(stored);
    }

    void loadUser();
  }, [allowedRoles, router]);

  return { user, loading };
}
