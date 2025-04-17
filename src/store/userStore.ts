import { create } from "zustand";
import { User } from "../types/user";

const initialUser: User = {
  companyName: "산들란",
  ceoName: "서장준",
  phoneNumber: "010-1234-5678",
  zipCode: "",
  address: "",
  addressDetail: "",
  region: "경기",
};

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  updateUser: (fields: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  updateUser: (fields) =>
    set((state) => ({ user: { ...state.user, ...fields } })),
}));
