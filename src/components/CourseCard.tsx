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

export default function CourseCard(props: any) {
  const { course, role } = props;
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);

  useEffect(() => {
    // Fetch the purchase status of the course on component mount
    fetch(
      `${BACKEND_URL}:${PORT}/users/courses/${course.course._id}/check-purchase`,
      {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsCoursePurchased(data.purchased);
      })
      .catch((error) => {
        console.error("Error checking course purchase status:", error);
      });
  }, []);

  const handlePurchase = () => {
    fetch(`${BACKEND_URL}:${PORT}/users/courses/${props.course.course._id}`, {
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
    <Card variant="outlined" style={{ width: 300, margin: 10, minHeight: 70 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" textAlign={"center"}>
          {props.course.course.title}
        </Typography>
      </div>
      <br />
      <Typography variant="subtitle1" textAlign={"center"}>
        {props.course.course.description}
      </Typography>
      <br />
      <Typography variant="h6" textAlign={"right"} style={{ padding: 5 }}>
        Rs. {props.course.course.price}
      </Typography>
      <br />
      <img
        src={props.course.course.imageLink}
        style={{ width: 300 }}
        alt="Course"
      />
      {role === "user" ? (
        <div style={{ padding: 5 }}>
          <Button
            variant={"contained"}
            onClick={handlePurchase}
            disabled={isCoursePurchased} // Disable the button if the course is already purchased
          >
            {isCoursePurchased ? "Course Purchased" : "Purchase Course"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
}
