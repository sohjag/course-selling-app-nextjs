import { selector } from "recoil";
import { courseDetail } from "../atoms/courseState";

export const isCourseLoading = selector({
  key: "isCourseLoadingState",
  get: ({ get }) => {
    const state = get(courseDetail);
    return state.isLoading;
  },
});

// export const courseDetails = selector({
//   key: "courseDetails",
//   get: ({ get }) => {
//     const state = get(courseDetail);
//     return state.course;
//   },
// });

// export const courseTitle = selector({
//   key: "courseTitle",
//   get: ({ get }) => {
//     const state = get(courseDetail);
//     if (state) {
//       return state.course?.title;
//     }
//     return "";
//   },
// });
