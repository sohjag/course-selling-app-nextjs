import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BACKEND_URL, PORT } from "../../constants/index";
import { userRoleSelected } from "@/store/selectors/userEmailAndRole";
import { useRecoilValue } from "recoil";
import EditCourseCard from "@/components/EditCourseCard";
import CourseCard from "@/components/CourseCard";
import Lessons from "@/components/Lessons";
import CourseLessons from "@/components/CourseLessons";
import AddLessonCard from "@/components/AddLessonsCard";

function Course() {
  const router = useRouter();
  let { courseId } = router.query;

  const [course, setCourse] = useState(null);
  const role = useRecoilValue(userRoleSelected);

  function callback2(data: any) {
    setCourse(data);
  }

  function callback1(res: any) {
    res.json().then(callback2);
  }

  useEffect(() => {
    fetch(`${BACKEND_URL}:${PORT}/admin/courses/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }).then(callback1);
  }, [courseId]);

  useEffect(() => {
    if (!role) {
      setCourse(null);
      router.push("/");
    }
  }, [role]);

  if (course) {
    if (role === "admin") {
      return (
        <div>
          <div>
            <CourseCard course={course} role={role} />
            <EditCourseCard course={course} />
            <Lessons course={course} />
            <AddLessonCard course={course} />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ padding: 50, marginBottom: 100 }}>
          {/* <CourseCard course={course} role={role} /> */}
          <CourseLessons course={course} />
        </div>
      );
    }
  } else {
    return <div style={{ minHeight: "1000px" }}>Loading...</div>;
  }
}

export default Course;
