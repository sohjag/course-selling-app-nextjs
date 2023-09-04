import { atom } from "recoil";

export interface ICourse {
  _id?: String;
  title: String;
  description: String;
  price: Number;
  imageLink: String;
  published: Boolean;
  courseLessons: string[] | ILessons[];
}

export interface ILessons {
  _id: string;
  title: string;
  description: string;
  lessonLink: string;
}

export const courseDetail = atom<{
  isLoading: boolean;
  course: ICourse[] | null;
}>({
  key: "courseDetailState",
  default: {
    isLoading: true,
    course: null,
  },
});
