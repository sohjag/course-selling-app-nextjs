import { atom } from "recoil";

export const userDetail = atom<{
  isLoading: boolean;
  userEmail: string | null;
  role: string | null;
}>({
  key: "userDetailState",
  default: {
    isLoading: true,
    userEmail: null,
    role: null,
  },
});
