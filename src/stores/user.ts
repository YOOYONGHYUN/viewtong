import { usersControllerGetSelf } from "@/queries";
import { UserResponseDto } from "@/queries/model";
import { create } from "zustand";

interface UserStore {
  user: UserResponseDto | null;
  setUser: (user: UserResponseDto) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const user = await usersControllerGetSelf();
    set({ user });
  },
}));
