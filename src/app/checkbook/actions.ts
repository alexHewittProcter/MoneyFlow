import { Breakdown } from "../lib/types/breakdown";

export const addBreakdown = (breakdown: Breakdown) => {
  fetch("/api/checkbook/breakdown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ breakdown }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const updateBreakdown = (breakdown: Breakdown) => {
  fetch("/api/checkbook/breakdown", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ breakdown }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
