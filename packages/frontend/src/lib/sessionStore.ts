import { create } from 'zustand';
import { Session, SessionMember } from '@collab/shared';

export interface SessionStore {
  currentSession: Session | null;
  members: SessionMember[];
  
  setCurrentSession: (session: Session | null) => void;
  setMembers: (members: SessionMember[]) => void;
  addMember: (member: SessionMember) => void;
  removeMember: (userId: string) => void;
  updateMember: (userId: string, updates: Partial<SessionMember>) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  currentSession: null,
  members: [],

  setCurrentSession: (session: Session | null) => {
    set({ currentSession: session });
  },

  setMembers: (members: SessionMember[]) => {
    set({ members });
  },

  addMember: (member: SessionMember) => {
    set((state) => ({
      members: [...state.members, member],
    }));
  },

  removeMember: (userId: string) => {
    set((state) => ({
      members: state.members.filter((m) => m.id !== userId),
    }));
  },

  updateMember: (userId: string, updates: Partial<SessionMember>) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.id === userId ? { ...m, ...updates } : m
      ),
    }));
  },
}));
