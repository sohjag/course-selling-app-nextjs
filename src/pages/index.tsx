import Head from "next/head";
import Image from "next/image";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  userEmailSelected,
  userRoleSelected,
} from "@/store/selectors/userEmailAndRole";
import { isUserLoadingSelected } from "@/store/selectors/isUserLoading";
import { useRouter } from "next/router";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${"https://www.hdwallpapers.in/download/horses_are_running_on_hills_with_background_of_clouds_and_sunbeam_hd_horse-1920x1080.jpg"}) center/cover`,
  backgroundSize: "cover",
  backgroundPosition: "center bottom",
  color: "#fff",
  padding: theme.spacing(10),
  textAlign: "center",
}));

const TitleTypography = styled(Typography)({
  fontWeight: 700,
  marginBottom: "1rem",
  color: "#fff",
  textTransform: "uppercase",
});

const SubtitleTypography = styled(Typography)({
  fontWeight: 400,
  marginBottom: "2rem",
});

const StyledButton = styled(Button)({
  background: "#322653",
  color: "#fff",
  padding: "0.8rem 2rem",
  fontWeight: 600,
  borderRadius: "50px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#544e7a",
  },
});

const Hero = ({ user }: any) => {
  const router = useRouter();
  //const { user } = props.user;
  return (
    <HeroSection>
      <Box maxWidth="800px" margin="0 auto">
        <TitleTypography variant="h3">Welcome to Horsera</TitleTypography>
        <SubtitleTypography variant="h5">
          Start Your Equestrian Journey Today
        </SubtitleTypography>
        {user ? (
          <StyledButton
            variant="contained"
            onClick={() => {
              router.push("/browsecourses");
            }}
          >
            Browse Courses
          </StyledButton>
        ) : (
          <StyledButton
            variant="contained"
            onClick={() => {
              //add navigation here
            }}
          >
            Join Now!
          </StyledButton>
        )}
      </Box>
    </HeroSection>
  );
};

const CTASection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(8),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    textAlign: "center",
  },
}));

const TextContent = styled(Box)(({ theme }) => ({
  maxWidth: "500px",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

const CTATitleTypography = styled(Typography)({
  fontWeight: 700,
  marginBottom: "1rem",
  color: "#322653",
  textTransform: "uppercase",
});

const CTASubtitleTypography = styled(Typography)({
  fontWeight: 400,
  marginBottom: "2rem",
  color: "#777",
});

const ImageContainer = styled(Box)({
  maxWidth: "600px",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
});

const CTAStyledButton = styled(Button)({
  backgroundColor: "#322653",
  color: "#fff",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#3d2f71",
  },
});

const CTA = ({ user }: any) => {
  const router = useRouter();
  return (
    <CTASection>
      <TextContent>
        <CTATitleTypography variant="h4">
          Skills you need today for a successful tomorrow
        </CTATitleTypography>
        <CTASubtitleTypography variant="body1">
          Bring your new horse riding career one step closer by getting a
          professional certificate. With our 100% online school and unique
          teaching method, you'll have the keys to your own success.
        </CTASubtitleTypography>
        {user ? (
          <CTAStyledButton
            variant="contained"
            size="large"
            onClick={() => {
              router.push("/browsecourses");
            }}
          >
            Start Learning Now!
          </CTAStyledButton>
        ) : (
          <>
            <CTAStyledButton
              variant="contained"
              size="large"
              onClick={() => {
                //add navigation here
              }}
            >
              Log In
            </CTAStyledButton>
            <CTAStyledButton
              variant="contained"
              size="large"
              onClick={() => {
                //add navigation here
              }}
            >
              Sign Up
            </CTAStyledButton>
          </>
        )}
      </TextContent>
      <ImageContainer>
        <img
          src="https://c4.wallpaperflare.com/wallpaper/53/696/45/girl-with-helmet-want-to-riding-horse-wallpaper-preview.jpg"
          alt="Call to Action"
          style={{ width: "100%" }}
        />
      </ImageContainer>
    </CTASection>
  );
};

const CTA2 = () => {
  return (
    <CTASection>
      <ImageContainer>
        <img
          src="https://c0.wallpaperflare.com/preview/866/596/942/man-riding-horse-near-plant-during-daytime.jpg"
          alt="Call to Action"
          style={{ width: "100%" }}
        />
      </ImageContainer>
      <TextContent>
        <CTATitleTypography variant="h4">
          UNLOCK THE ART OF HORSEMANSHIP
        </CTATitleTypography>
        <CTASubtitleTypography variant="body1">
          Discover the art of horsemanship with our immersive and hands-on
          courses. Whether you're a beginner or an experienced rider, our expert
          instructors will guide you through the intricacies of riding,
          training, and bonding with these majestic creatures. Enroll now to
          unleash your potential and embark on a rewarding journey with horses.
        </CTASubtitleTypography>
      </TextContent>
    </CTASection>
  );
};

function Home() {
  const userLoading = useRecoilValue(isUserLoadingSelected);
  const user = useRecoilValue(userEmailSelected);

  return (
    <div>
      <Hero user={user} />
      <CTA user={user} />
      <CTA2 />
    </div>
  );
}

export default Home;
