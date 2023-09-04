import { Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageComponent from "./ImageComponent";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  userEmailSelected,
  userRoleSelected,
} from "@/store/selectors/userEmailAndRole";
import { isUserLoadingSelected } from "@/store/selectors/isUserLoading";
import { userDetail } from "@/store/atoms/user";
import { courseDetail } from "@/store/atoms/courseState";

const AppbarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#322653",
  color: "#fff",
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const LogoTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 700,
  color: "#fff",
  textTransform: "uppercase",
});

const StyledButton = styled(Button)({
  color: "white",
  background: "#322653", // Match the background color of the appbar
  marginLeft: "10px", // Adjust spacing as needed
});

export default function Appbar() {
  const router = useRouter();
  const userLoading = useRecoilValue(isUserLoadingSelected);
  const userEmail = useRecoilValue(userEmailSelected);
  const role = useRecoilValue(userRoleSelected);
  const setUser = useSetRecoilState(userDetail);
  const setCourse = useSetRecoilState(courseDetail);

  if (userEmail) {
    if (role === "admin") {
      return (
        <AppbarContainer
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <LogoTypography variant="h6" onClick={() => router.push("/")}>
            <ImageComponent /> Horsera
          </LogoTypography>
          <div style={{ display: "flex", padding: 5 }}>
            <div style={{ padding: 5 }}>{userEmail}</div>
            <div style={{ padding: 5 }}>
              <StyledButton
                variant={"contained"}
                onClick={() => {
                  // window.location = "/signup";
                  router.push("/browsecourses");
                }}
              >
                Browse Courses
              </StyledButton>
            </div>
            <div style={{ padding: 5 }}>
              <StyledButton
                variant={"contained"}
                onClick={() => {
                  // window.location = "/signup";
                  router.push("/addcourse");
                }}
              >
                Add a course
              </StyledButton>
            </div>
            <div style={{ padding: 5 }}>
              <StyledButton
                variant="contained"
                onClick={() => {
                  // window.location = "/login";
                  localStorage.setItem("token", "");
                  setUser({
                    isLoading: false,
                    userEmail: null,
                    role: null,
                  });
                  setCourse({
                    isLoading: false,
                    course: null,
                  });
                  router.push("/");
                }}
              >
                Log out
              </StyledButton>
            </div>
          </div>
        </AppbarContainer>
      );
    }

    //if role is user
    return (
      <AppbarContainer
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <LogoTypography variant="h6" onClick={() => router.push("/")}>
          <ImageComponent />
        </LogoTypography>
        <div style={{ display: "flex", padding: 5 }}>
          <div style={{ padding: 5 }}>{userEmail}</div>
          <div style={{ padding: 5 }}>
            <StyledButton
              variant={"contained"}
              onClick={() => {
                router.push("/browsecourses");
              }}
            >
              Browse courses
            </StyledButton>
          </div>
          <div style={{ padding: 5 }}>
            <StyledButton
              variant="contained"
              onClick={() => {
                // window.location = "/login";
                localStorage.setItem("token", "");
                setUser({
                  isLoading: false,
                  userEmail: null,
                  role: null,
                });
                router.push("/");
              }}
            >
              Log out
            </StyledButton>
          </div>
        </div>
      </AppbarContainer>
    );
  }

  return (
    <AppbarContainer
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <LogoTypography variant="h6" onClick={() => router.push("/")}>
        <ImageComponent />
      </LogoTypography>
      <div style={{ display: "flex", padding: 5 }}>
        <div style={{ padding: 5 }}>
          <StyledButton
            variant={"contained"}
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign up
          </StyledButton>
        </div>
        <div style={{ padding: 5 }}>
          <StyledButton
            variant="contained"
            onClick={() => {
              router.push("/login");
            }}
          >
            Sign in
          </StyledButton>
        </div>
      </div>
    </AppbarContainer>
  );
}

//export default Appbar;
