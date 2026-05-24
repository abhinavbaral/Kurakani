const getDuration = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const date = new Date(timestamp);

  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMs < 0 || diffMin <= 1) return "Just now";

  if (diffMin < 60) return `${diffMin} minutes ago`;

  if (diffMin < 24 * 60) {
    const hours = Math.floor(diffMin / 60);
    return `${hours} hours ago`;
  }

  const isToday = now.toDateString() === date.toDateString();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (yesterday.toDateString() === date.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
};

export default getDuration;