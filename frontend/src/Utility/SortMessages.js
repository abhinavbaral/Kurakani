function sortMessages(messages) {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}

export default sortMessages;