export const convertTime = (time: number | string | bigint) => {
  // Convert BigInt to number if needed
  const numericTime =
    typeof time === "bigint"
      ? Number(time)
      : typeof time === "string"
      ? Number(time)
      : time;

  // Check for invalid/zero time
  if (numericTime <= 0 || isNaN(numericTime)) {
    return "-";
  }

  // Convert seconds to milliseconds for JS Date
  const jsTimestamp = numericTime * 1000;
  const date = new Date(jsTimestamp);

  // Validate the date
  if (isNaN(date.getTime())) {
    console.log("Invalid time value:", time);
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};
