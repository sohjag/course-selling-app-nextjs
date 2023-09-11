import { useSetRecoilState } from "recoil";
import { userDetail } from "../store/atoms/user";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL, PORT } from "../constants";

export function InitUser() {
  const setUser = useSetRecoilState(userDetail);

  const init = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}:${PORT}/api/role/me`,
        {}
      );
      if (response.data.username) {
        setUser({
          isLoading: false,
          userEmail: response.data.username,
          role: response.data.role,
        });
      } else {
        setUser({
          isLoading: false,
          userEmail: null,
          role: null,
        });
      }
    } catch (e) {
      setUser({
        isLoading: false,
        userEmail: null,
        role: null,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return <></>;
}
