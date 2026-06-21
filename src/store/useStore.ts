import { create } from 'zustand'

interface AppState {
  isRecruiterMode: boolean
  toggleRecruiterMode: () => void
  setRecruiterMode: (value: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  isRecruiterMode: false,
  toggleRecruiterMode: () => set((state) => ({ isRecruiterMode: !state.isRecruiterMode })),
  setRecruiterMode: (value) => set({ isRecruiterMode: value }),
}))
