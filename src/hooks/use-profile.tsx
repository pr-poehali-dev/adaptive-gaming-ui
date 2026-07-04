import { useCallback, useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

export interface Profile {
  nickname: string;
  nickname_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  frame_url: string | null;
  medals: string[];
}

const DEFAULT_PROFILE: Profile = {
  nickname: '',
  nickname_color: '#ffffff',
  avatar_url: null,
  banner_url: null,
  frame_url: null,
  medals: [],
};

export function useProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(() => {
    if (!token) {
      setProfile(null);
      return;
    }
    setLoading(true);
    fetch(API.profile, { headers: { 'X-Authorization': `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : DEFAULT_PROFILE))
      .then((data) => setProfile({ ...DEFAULT_PROFILE, ...data }))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!token) return;
      const res = await fetch(API.profile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...DEFAULT_PROFILE, ...data });
      }
    },
    [token]
  );

  const uploadImage = useCallback(
    async (file: File, kind: 'avatar' | 'banner' | 'frame'): Promise<string | null> => {
      if (!token) return null;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(API.uploadImage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image: base64, contentType: file.type, kind }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url as string;
    },
    [token]
  );

  return { profile, loading, updateProfile, uploadImage, refetch: fetchProfile };
}
