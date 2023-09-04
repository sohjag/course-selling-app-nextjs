import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Card, TextField, CardContent } from "@mui/material";
import axios from "axios";
import { BACKEND_URL, PORT } from "../constants/index";
import { ILessons } from "@/store/atoms/courseState";

export default function AddLessonCard(props: any) {
  const [lessonsArr, setLessonsArr] = useState<ILessons[]>();
  const [title, setLessonTitle] = useState<string | null>(null);
  const [description, setLessonDescription] = useState<string | null>(null);
  const [lessonLink, setLessonLink] = useState<string | null>(null);
  let courseId = props.course.course._id;
  const router = useRouter();

  const handleAddLesson = () => {
    axios({
      method: "post",
      url: `${BACKEND_URL}:${PORT}/admin/courses/${props.course.course._id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: { title, description, lessonLink, courseId },
    })
      .then((res) => {
        if (res.status === 200) {
          //alert("Lesson added successfully");
          //navigate(`/course/${props.course.course._id}`);
          window.location.reload();
        } else {
          alert("Error in adding lesson");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Card>
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <TextField
              fullWidth={true}
              variant="outlined"
              label="LessonTitle"
              onChange={(e) => {
                setLessonTitle(e.target.value);
              }}
            ></TextField>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <TextField
              fullWidth={true}
              variant="outlined"
              label="LessonDescription"
              onChange={(e) => {
                setLessonDescription(e.target.value);
              }}
            ></TextField>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <TextField
              variant="outlined"
              fullWidth={true}
              label="LessonLink"
              onChange={(e) => {
                setLessonLink(e.target.value);
              }}
            ></TextField>
          </div>

          <Button variant={"contained"} onClick={handleAddLesson}>
            Add Lesson
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
