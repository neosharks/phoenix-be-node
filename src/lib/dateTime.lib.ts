export const getDateInDDMMYYYY = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  return {
    space: `${day} ${month} ${year}`,
    dash: `${day}-${month}-${year}`,
    dot: `${day}.${month}.${year}`,
    slash: `${day}/${month}/${year}`,
    underscore: `${day}_${month}_${year}`,
  };
};

export const getDateInYYYYMMDD = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return {
    space: `${year} ${month} ${day}`,
    dash: `${year}-${month}-${day}`,
    dot: `${year}.${month}.${day}`,
    slash: `${year}/${month}/${day}`,
    underscore: `${year}_${month}_${day}`,
  };
};
