export const convertTime = (time: number | string) => {
  const newTime = new Date(typeof time === "string" ? Number(time) : time);

  if (isNaN(newTime.getTime())) {
    console.log("Invalid time value:", time);
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(newTime);
};
