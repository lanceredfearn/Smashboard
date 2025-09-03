import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Announcement } from '@/types';

interface AnnouncementStore {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

const generateId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export const useAnnouncements = create<AnnouncementStore>()(
  persist(
    (set) => ({
      announcements: [],
      addAnnouncement: (announcement) =>
        set((state) => ({
          announcements: [
            { id: generateId(), date: new Date().toISOString(), ...announcement },
            ...state.announcements,
          ],
        })),
    }),
    { name: 'announcements' }
  )
);
