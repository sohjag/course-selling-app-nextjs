import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL, PORT } from "../constants/index";

export default function EditCourseCard(props: any) {
  //   console.log("rendering edit course card...");
  //   console.log(props.course.course.title);
  const router = useRouter();
  let { courseId } = router.query;

  const [title, setTitle] = useState(props.course.course.title);
  const [description, setDescription] = useState(
    props.course.course.description
  );
  const [price, setPrice] = useState(props.course.course.price);
  const [imageLink, setImageLink] = useState(props.course.course.imageLink);

  useEffect(() => {
    setTitle(props.course.course.title);
    setDescription(props.course.course.description);
    setPrice(props.course.course.price);
    setImageLink(props.course.course.imageLink);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 150 }}>
      <Card variant="outlined" style={{ width: 500 }}>
        <div style={{ padding: 10 }}>
          <Typography variant="h5">Update course</Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <TextField
            fullWidth={true}
            variant="outlined"
            label="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></TextField>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <TextField
            fullWidth={true}
            variant="outlined"
            label="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></TextField>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <TextField
            variant="outlined"
            fullWidth={true}
            label="Price"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          ></TextField>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <TextField
            variant="outlined"
            fullWidth={true}
            label="Image link"
            onChange={(e) => {
              setImageLink(e.target.value);
            }}
          ></TextField>
        </div>
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              axios({
                method: "put",
                url: `${BACKEND_URL}:${PORT}/admin/courses/${courseId}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
                data: { title, description, price, imageLink },
              })
                .then((res) => {
                  if (res.status === 200) {
                    alert("Course added successfully");
                  } else {
                    alert("Error in adding course");
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Update Course
          </Button>
        </div>
      </Card>
    </div>
  );
}
