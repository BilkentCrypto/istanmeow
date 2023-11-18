export function timeAgo(timestamp) {
  const now = new Date();
  let duration = now - new Date(timestamp);

  // Define the duration in milliseconds for each time unit
  const durations = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000,
    months: 2592000000,
    years: 31536000000,
  };

  // Calculate the duration in years, months, days, hours, minutes, and seconds
  let years = Math.floor(duration / durations.years);
  duration -= years * durations.years;
  let months = Math.floor(duration / durations.months);
  duration -= months * durations.months;
  let days = Math.floor(duration / durations.days);
  duration -= days * durations.days;
  let hours = Math.floor(duration / durations.hours);
  duration -= hours * durations.hours;
  let minutes = Math.floor(duration / durations.minutes);
  duration -= minutes * durations.minutes;
  let seconds = Math.floor(duration / durations.seconds);

  // Format the duration string
  const formattedDuration = [];
  if (years > 0) {
    formattedDuration.push(`${years} years`);
  }
  if (months > 0) {
    formattedDuration.push(`${months} months`);
  }
  if (days > 0) {
    formattedDuration.push(`${days} days`);
  }
  if (hours > 0) {
    formattedDuration.push(`${hours} hours`);
  }
  if (minutes > 0) {
    formattedDuration.push(`${minutes} minutes`);
  }
  // if (seconds > 0) {
  //   formattedDuration.push(`${seconds} seconds`);
  // }

  // Join the formatted duration units into a string
  let timeAgoString = '';
  if (formattedDuration.length > 1) {
    timeAgoString = `${formattedDuration.slice(0, -1).join(', ')} and ${
      formattedDuration[formattedDuration.length - 1]
    }`;
  } else if (formattedDuration.length === 1) {
    timeAgoString = formattedDuration[0];
  } else {
    return 'just now';
  }
  return `${timeAgoString} ago`;
}
