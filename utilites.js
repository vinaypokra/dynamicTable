
import _get from 'lodash/get';
import dayjs from 'dayjs';

const removeDecimal = (value, decimals = 2) => {
    //return value.toFixed(decimals);
    // return new Intl.NumberFormat().format(value.toFixed(decimals));
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals
    }).format(value);
  };
  
export default removeDecimal;
  

export const getLabels = (key) => {
    return _get(constants, `label.${key}`, camelToTitleCase(key));
  };
  
  export const getRegex = (key) => {
    return _get(constants, `regex.${key}`, false);
};
  
export const getDateFormate = (key, val) => {
    if (userLoginType) {
      if (constants?.date?.dateLabel?.includes(key)) {
        if (constants?.date?.dateLabelWithTime?.includes(key)) {
          return dayjs(val).format(constants.date['360user']?.DATE_TIME_FORMAT);
        }
        return dayjs(val).format(constants.date['360user']?.DATE_FORMAT1);
      }
      return val;
    } else {
      if (constants?.date?.dateLabel?.includes(key)) {
        if (constants?.date?.dateLabelWithTime?.includes(key)) {
          return dayjs(val).format(constants.date.DATE_TIME_FORMAT);
        }
        return dayjs(val).format(constants.date.DATE_FORMAT);
      }
      return val;
    }
  };
  