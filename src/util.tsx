import dayjs from "dayjs"

const getMonth = (month = dayjs().month()) => {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export const getDay = (day = dayjs().day()) => {
  const year = dayjs().year();
  const month = dayjs().month();
  let startHour = -1;
  const hourArray = new Array(24).fill([]).map(() => {
    startHour++;
    return dayjs(new Date(year, month, day)).hour(startHour).minute(0);
  });
  return hourArray
}

export default getMonth;