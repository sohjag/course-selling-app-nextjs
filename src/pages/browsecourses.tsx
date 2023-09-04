import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Typography, Button, Box, backdropClasses } from "@mui/material";
import { BACKEND_URL, PORT } from "../constants/index";
import { courseDetail } from "@/store/atoms/courseState";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { userRoleSelected } from "@/store/selectors/userEmailAndRole";
import axios from "axios";
import { useRouter } from "next/router";
import { ICourse } from "@/store/atoms/courseState";

//function BrowseCourses({ courses }: { courses: ICourse[] })
function BrowseCourses() {
  const setCourses = useSetRecoilState(courseDetail);
  const courses = useRecoilValue(courseDetail);
  const role = useRecoilValue(userRoleSelected);
  //   if (courses) {
  //     setCourses({
  //       isLoading: false,
  //       course: courses,
  //     });
  //   }

  const initCourses = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}:${PORT}/browsecourses`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.courses) {
        setCourses({
          isLoading: false,
          course: response.data.courses,
        });
      } else {
        setCourses({
          isLoading: false,
          course: null,
        });
      }
    } catch (e) {
      setCourses({
        isLoading: false,
        course: null,
      });
    }
  };

  useEffect(() => {
    initCourses();
  }, []);

  if (courses.course) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {courses.course.map((course) => {
          return <RenderCourse key={course._id} course={course} role={role} />;
        })}
      </div>
    );
  }
  return <div style={{ minHeight: "1000px" }}>Loading...</div>;
}

function RenderCourse(props: any) {
  const router = useRouter();
  const { course, role } = props;
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);
  const [courseDetailState, setCourseDetailState] =
    useRecoilState(courseDetail);

  useEffect(() => {
    // Fetch the purchase status of the course on component mount
    fetch(`${BACKEND_URL}:${PORT}/users/courses/${course._id}/check-purchase`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsCoursePurchased(data.purchased);
      })
      .catch((error) => {
        console.error("Error checking course purchase status:", error);
      });
  }, [course._id]);

  const handlePurchaseCourse = () => {
    fetch(`${BACKEND_URL}:${PORT}/users/courses/${props.course._id}`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsCoursePurchased(true); // Course purchased successfully, update the state
        } else {
          console.error("Failed to purchase course");
        }
      })
      .catch((error) => {
        console.error("Error purchasing course:", error);
      });
  };

  return (
    //<div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
    <Card variant="outlined" style={{ width: 400, margin: 10, minHeight: 70 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={50}
      >
        <Typography
          variant="h6"
          textAlign="center"
          style={{ fontFamily: "Poppins", fontWeight: "bold" }}
        >
          {props.course.title}
        </Typography>
      </Box>
      <Box p={2} minHeight="400px">
        <Typography variant="subtitle1" textAlign="center" marginBottom={3}>
          {props.course.description}
        </Typography>
        <Typography
          variant="h6"
          textAlign="right"
          style={{ fontFamily: "Georgia", padding: 5, fontWeight: "bold" }}
        >
          ${props.course.price}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
          bgcolor="black"
          marginTop={3}
        >
          <img
            src={props.course.imageLink}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: 5,
            }}
            alt="Course"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box>
          {isCoursePurchased || role === "admin" ? (
            <Button
              variant="contained"
              onClick={() => {
                router.push(`/course/${props.course._id}`);
              }}
            >
              View Course
            </Button>
          ) : null}
        </Box>
        <Box>
          {role === "admin" ? (
            <Button
              variant="contained"
              onClick={() => {
                function callback2(data: any) {
                  //alert("lesson deleted successfully");
                  setCourseDetailState((prevState) => ({
                    ...prevState,
                    course:
                      prevState.course?.filter(
                        (course) => course._id !== props.course._id
                      ) || null,
                  }));
                }
                function callback1(res: any) {
                  res.json().then(callback2);
                }
                fetch(
                  `${BACKEND_URL}:${PORT}/admin/courses/${props.course._id}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: localStorage.getItem("token") || "",
                    },
                  }
                ).then(callback1);
              }}
            >
              Delete
            </Button>
          ) : null}
        </Box>
        {role === "user" ? (
          <Box>
            {isCoursePurchased ? (
              <Typography variant="subtitle1" color="primary">
                Course Purchased
              </Typography>
            ) : (
              <Button variant="contained" onClick={handlePurchaseCourse}>
                Purchase Course
              </Button>
            )}
          </Box>
        ) : null}
      </Box>
    </Card>
    //</div>
  );
}

export default BrowseCourses;

// export async function getServerSideProps() {
//   const response = await axios.get(`${BACKEND_URL}:${PORT}/browsecourses`, {
//     headers: {
//       Authorization: localStorage.getItem("token"),
//     },
//   });
//   return {
//     props: {
//       courses: response.data.courses,
//     },
//   };
// }
