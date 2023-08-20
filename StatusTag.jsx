import React from 'react';
import { Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { STATUS_MAPPING as statusMapping } from 'common/constants/constants';
import colorCodes from '../../theme/colorCodes';
const useStyles = makeStyles((theme) => ({
  chip: {
    color: '#fff',
    width: 'fit-content',
    minWidth: theme.spacing(14),

    '& .MuiChip-label.MuiChip-labelSmall': {
      fontSize: '10px'
    }
  },
  success: {
    backgroundColor: theme.palette.primary.success,
    color: theme.palette.primary.success
  },
  warning: {
    backgroundColor: theme.palette.primary.warningMain,
    color: theme.palette.primary.warningMain
  },
  error: {
    backgroundColor: theme.palette.primary.unsuccess,
    color: theme.palette.primary.unsuccess
  },
  info: {
    backgroundColor: theme.palette.secondary.azureBlue,
    color: theme.palette.secondary.azureBlue
  },
  default: {
    color: theme.palette.primary.darkGrey
  },
  fullWidth: {
    width: '100%',
    justifyContent: 'left'
  },
  square: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0, 2)
  }
}));

const success = [
  'added',
  'uploaded',
  'available',
  'active',
  'approved',
  'acknowledged',
  'proccessed',
  'processed',
  'completed',
  'planned',
  'paid',
  'unblacklisted',
  'cleared',
  'success'
];
const warning = [
  'readytoprocess',
  'delayed',
  'pending',
  'processing',
  'availed',
  'waitingforchequeclearance',
  ' pendingapproval',
  'launched',
  'medium'
];
const error = [
  'rejected',
  'skipped',
  'failed',
  'leave',
  'in-active',
  'inactive',
  'cancelled',
  'unpaid',
  'blacklist',
  'voided',
  'terminated',
  'breach',
  'blacklisted',
  'removed',
  'blacklist',
  'critical',
  'low'
];
const info = [
  'downloaded',
  'onleave',
  'high',
  'waitingfordirectorapproval',
  'waitingforcustomerconfirmation',
  'waitingforsupervisorapproval',
  'awaitingcfoemailapproval',
  'promisetopaybreached'
];

const getStatusClassName = (value, statusMap) => {
  //status mapping
  const status = statusMap?.[Number(value) || value]
    ?.toLowerCase()
    ?.split(' ')
    .join('');
  if (success.includes(status)) {
    return 'success';
  } else if (warning.includes(status)) {
    return 'warning';
  } else if (error.includes(status)) {
    return 'error';
  } else if (info.includes(status)) {
    return 'info';
  }
  return 'default';
};

const getStyle = (style = '') => {
  return {
    vanillaCustard: {
      color: 'black',
      backgroundColor: '#f6f098'
    },
    twilightBlue: {
      backgroundColor: '#6b64df',
      color: colorCodes.primary.white
    },
    vividViolet: {
      backgroundColor: '#c473e8',
      color: colorCodes.primary.white
    },
    roseGlow: {
      backgroundColor: '#ee7884',
      color: colorCodes.primary.white
    },
    forestGreen: {
      backgroundColor: '#01874a',
      color: colorCodes.primary.white
    },
    mintyFresh: {
      backgroundColor: '#28cab5',
      color: colorCodes.primary.white
    },
    cottonCloud: {
      backgroundColor: '#fefeff',
      color: colorCodes.primary.white
    },
    error: {
      backgroundColor: colorCodes.primary.unsuccess,
      color: colorCodes.primary.white
    },
    lavenderMist: {
      backgroundColor: '#e5e1fb',
      color: 'black'
    }
  }?.[style];
};
const StatusTag = ({
  value = false,
  statusMap = statusMapping,
  size = false,
  statusText = false,
  label = false,
  tagStyle = false,
  colorStyleName = '',
  fullWidth = false,
  icon = null,
  square = false
}) => {
  const classes = useStyles();
  if (label) {
    value = label;
  }
  if (value === false) return null;
  return (
    (statusText && (
      <Typography
        style={{ backgroundColor: 'transparent' }}
        className={classes[getStatusClassName(value, statusMap)]}
      >
        {statusMap[Number(value) || value]}
      </Typography>
    )) || (
      <Chip
        icon={icon}
        size={size || 'medium'}
        style={
          getStyle(colorStyleName) || {
            color: 'white'
          }
        }
        label={label || statusMap[Number(value) || value]}
        className={`${classes.chip} ${
          classes[tagStyle || getStatusClassName(value, statusMap)]
        } ${fullWidth && classes.fullWidth}  ${square && classes.square}`}
      />
    )
  );
};
export default StatusTag;
