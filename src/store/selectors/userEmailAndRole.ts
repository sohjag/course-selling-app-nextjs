import { selector } from "recoil";
import { userDetail } from "../atoms/user";

export const userEmailSelected = selector({
  key: "userEmailState",
  get: ({ get }) => {
    const state = get(userDetail);
    return state.userEmail;
  },
});

export const userRoleSelected = selector({
  key: "userRoleState",
  get: ({ get }) => {
    const state = get(userDetail);
    return state.role;
  },
});
