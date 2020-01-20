import moment from 'moment';

const dateFormatter = (dateString, type) => {
  const date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
  const dateDifference = moment().diff(date, 'days');
  const isSameDay = date.isSame(moment(), 'day');
  if (dateDifference > 6) {
    return moment(date).format('DD/MM/YYYY');
  } else if (dateDifference >= 1) {
    return date.format('dddd');
  } else {
    if (isSameDay) {
      return type === 'messages' ? 'Today' : date.format('HH:mm');
    } else {
      return date.format('dddd');
    }
  }
}; 

export const timeFormatter = (dateString) => {
  const date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
  return date.format('HH:mm');
}

export default dateFormatter;
