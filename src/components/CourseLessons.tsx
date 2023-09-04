import { useEffect, useState } from "react";
import { Button, Card, Typography } from "@mui/material";
import axios from "axios";
import { BACKEND_URL, PORT } from "../constants/index";
import { ILessons } from "@/store/atoms/courseState";
import YouTube from "react-youtube";
import getYouTubeVideoId from "@/lib/getYoutubeVideoId";

export default function CourseLessons(props: any) {
  const { course } = props.course;
  const [selectedLesson, setSelectedLesson] = useState<ILessons>();
  const [courseLessons, setCourseLessons] = useState<ILessons[]>();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setCourseLessons(course.courseLessons);
  }, [course]);

  useEffect(() => {
    if (courseLessons && courseLessons.length > 0) {
      setSelectedLesson(courseLessons[0]);
    }
  }, [courseLessons]);

  useEffect(() => {
    async function fetchCompletedLessons() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}:${PORT}/users/courses/${course._id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const completedLessonsData = response.data;
        const completedLessonIds = completedLessonsData.map(
          (lesson: any) => lesson._id
        );
        setCompletedLessons(new Set(completedLessonIds));
      } catch (error) {
        console.error("Error fetching completed lessons:", error);
      }
    }

    fetchCompletedLessons();
  }, [course]);

  useEffect(() => {
    setCompletedLessons((prevCompletedLessons) => {
      if (prevCompletedLessons) {
        return new Set([...prevCompletedLessons]);
      }
      return new Set();
    });
  }, [completedLessons]);
  // console.log("selected lesson is...");
  // console.log(selectedLesson);

  return courseLessons && selectedLesson ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{}}>
        <Typography variant="h5" style={{ marginBottom: "10px" }}>
          {selectedLesson.title}
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap", padding: "10" }}>
          <div style={{}}>
            <YouTube
              videoId={getYouTubeVideoId(selectedLesson.lessonLink) || ""}
            />
          </div>
          <div style={{ maxWidth: "50%", padding: "10" }}>
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              {selectedLesson.description}
            </Typography>
          </div>
        </div>

        {selectedLesson &&
        completedLessons &&
        completedLessons.has(selectedLesson._id) ? (
          <Button
            variant={"contained"}
            disabled={true}
            style={{ marginTop: "10px" }}
          >
            Completed
          </Button>
        ) : (
          <Button
            variant={"contained"}
            style={{ marginTop: "10px" }}
            onClick={async () => {
              try {
                await axios.put(
                  `${BACKEND_URL}:${PORT}/users/courses/${course._id}/${selectedLesson._id}`,
                  {},
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );
                setCompletedLessons(
                  new Set([...completedLessons, selectedLesson._id])
                );
              } catch (error) {
                console.error("Error marking lessons as complete", error);
              }
            }}
          >
            Mark as completed
          </Button>
        )}
      </div>
      <div>
        <Typography variant="h5" style={{ marginBottom: "10px" }}>
          Lessons
        </Typography>
        {courseLessons &&
          courseLessons.map((lesson) => {
            //AED8CC
            return (
              <Card
                key={lesson._id}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  border:
                    selectedLesson._id === lesson._id
                      ? "2px solid #322653"
                      : "none",
                  backgroundColor:
                    completedLessons && completedLessons.has(lesson._id)
                      ? "#AED8CC"
                      : "white",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  setSelectedLesson(lesson);
                }}
              >
                <div> {lesson.title}</div>
                {completedLessons && completedLessons.has(lesson._id) && (
                  <div>✓</div>
                )}
              </Card>
            );
          })}
      </div>
    </div>
  ) : (
    <div>Lessons not available</div>
  );
}
