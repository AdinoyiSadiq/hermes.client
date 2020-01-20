import moment from 'moment';

const checkDateDifference = (firstDateString, secondDateString) => {
  const firstDate = moment(firstDateString, 'YYYY-MM-DD HH:mm:ss');
  const secondDate = moment(secondDateString, 'YYYY-MM-DD HH:mm:ss');
  const duration = moment.duration(firstDate.diff(secondDate));
  const hours = duration.asHours();
  const isSameDay = firstDate.isSame(secondDate, 'day');
  if (Math.abs(hours) >= 24 || !isSameDay) {
    return true
  }
};  

export default checkDateDifference;
