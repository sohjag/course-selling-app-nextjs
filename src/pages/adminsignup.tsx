// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import axios from "axios";
import { BACKEND_URL, PORT } from "../constants/index";
import { useRouter } from "next/router";
import { userDetail } from "@/store/atoms/user";
import { useSetRecoilState } from "recoil";

function AdminSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userDetail)
  const router = useRouter()

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 150,
        marginBottom: 150,
      }}
    >
      <Card variant="outlined" style={{ width: 400 }}>
        <div style={{ padding: 10 }}>
          <Typography variant="h6">
            Welcome to Horsera. Sign up here for admin access.
          </Typography>
        </div>
        <div style={{ padding: 10 }}>
          <TextField
            fullWidth={true}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div style={{ padding: 10 }}>
          <TextField
            fullWidth={true}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type={"password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <br />
        <div style={{ padding: 10 }}>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              axios({
                method: "post",
                url: `${BACKEND_URL}:${PORT}/admin/signup`,
                headers: { "Content-Type": "application/json" },
                data: { username, password },
              })
                .then((res) => {
                  if (res.status === 200) {
                    localStorage.setItem("token", "Bearer " + res.data.token);
                    setUser({
                        isLoading:false,
                        userEmail:username,
                        role:"admin"
                    })
                    router.push("/")
                  } else {
                    alert("error in sign up");
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Sign up
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AdminSignup;
