import { userDetail } from "../atoms/user";
import { selector } from "recoil";

export const isUserLoadingSelected = selector({
  key: "isUserLoading",
  get: ({ get }) => {
    const state = get(userDetail);
    return state.isLoading;
  },
});
