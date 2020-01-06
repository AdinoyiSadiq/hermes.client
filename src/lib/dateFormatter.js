import moment from 'moment';

const dateFormatter = (dateString) => {
  const date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
  const dateDifference = moment().diff(date, 'days');
  if (dateDifference > 6) {
    return moment(date).format('DD/MM/YYYY');
  } else if (dateDifference >= 1) {
    return date.format('dddd');
  } else {
    return date.format('HH:mm');
  }
}; 

export default dateFormatter;
