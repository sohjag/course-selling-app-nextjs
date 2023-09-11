import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  CardContent,
  Modal,
} from "@mui/material";
import { BACKEND_URL, PORT } from "../constants/index";
import { ILessons } from "@/store/atoms/courseState";
import YouTube from "react-youtube";
import getYouTubeVideoId from "@/lib/getYoutubeVideoId";

export default function Lessons(props: any) {
  const router = useRouter();

  let initlessonsArr = props.course.course.courseLessons;
  const [lessonsArr, setLessonsArr] = useState<ILessons[] | null>(
    initlessonsArr
  );
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [lessonDescription, setLessonDescription] = useState<string | null>(
    null
  );
  const [lessonLink, setLessonLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<ILessons | null>(null);
  const modalStyle = {
    display: "flex",
    //flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
    padding: 20,
    width: 400,
    height: 600,
    margin: "auto",
    flex: 1,
  };

  const handleEdit = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  useEffect(() => {
    if (selectedLesson) {
      setIsModalOpen(true);
    }
  }, [selectedLesson]);

  function getLessonCallback2(data: any) {
    setLessonsArr(data.course.courseLessons);
  }
  function getLessonCallback1(res: any) {
    res.json().then(getLessonCallback2);
  }
  const getLessons = () => {
    fetch(
      `${BACKEND_URL}:${PORT}/api/admin/courses/${props.course.course._id}`,
      {
        method: "GET",
      }
    ).then(getLessonCallback1);
  };
  const handleUpdateLesson = () => {
    window.location.reload();
  };

  return (
    <div>
      {lessonsArr?.map((lesson: any) => (
        <Card
          key={lesson._id}
          variant="outlined"
          style={{ width: 500, margin: 10, minHeight: 100, padding: 10 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" textAlign={"center"}>
              {lesson.title}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="subtitle1" textAlign={"center"}>
              {lesson.description}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <YouTube videoId={getYouTubeVideoId(lesson.lessonLink) || ""} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={() => handleEdit(lesson)}>
              Edit
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                console.log("deleting a lesson...");
                console.log(lesson);
                function callback2(data: any) {
                  //alert("lesson deleted successfully");
                  getLessons();
                  router.push(`/course/${props.course.course._id}`);
                }
                function callback1(res: any) {
                  res.json().then(callback2);
                }
                fetch(
                  `${BACKEND_URL}:${PORT}/api/admin/lessons/${lesson._id}`,
                  {
                    method: "DELETE",
                  }
                ).then(callback1);
              }}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
      {selectedLesson ? (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          {
            <div style={modalStyle}>
              <Card style={{ overflow: "auto" }}>
                <CardContent>
                  <Typography variant="h6">{selectedLesson.title}</Typography>
                  <Typography variant="subtitle1">
                    {selectedLesson.description}
                  </Typography>
                  <YouTube
                    videoId={getYouTubeVideoId(selectedLesson.lessonLink) || ""}
                  />
                  {/* ... Add textfields and save button for editing ... */}
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

                  <Button variant={"contained"} onClick={handleUpdateLesson}>
                    Update
                  </Button>
                </CardContent>
              </Card>
            </div>
          }
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
}
