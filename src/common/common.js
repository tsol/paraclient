const dateFromUnix = (unixtime) => {
  const od = new Date(unixtime);
  return `${od.toLocaleDateString('ru-RU')} ${od.toLocaleTimeString('ru-RU')}`;
};

const dateToUnix = (dateString) => {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  return date.getTime();
};

export { dateFromUnix, dateToUnix };
