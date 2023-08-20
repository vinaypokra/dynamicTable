import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  TableContainer,
  CircularProgress,
  Typography,
  Checkbox,
  Radio,
  Button
} from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import constants from 'common/constants/constants';
import dayjs from 'dayjs';
import { getLabels, getRegex,removeDecimal, getDateFormate } from './utilites';
import { styled } from '@mui/material/styles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import StatusTag from './StatusTag';
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500
  }
});
function createData(
  data = [],
  hideColumns = [],
  orderBy = [],
  editable = false,
  onlyDisplay = false,
  extraActions = false
) {
  let headings = [];
  const temp = [...orderBy];
  if (Array.isArray(data) && data.length > 0) {
    const newData = data.map((item, index) => {
      if (item === undefined) {
        item = {};
      }
      if (index === 0) {
        headings = Object.keys(item);
        headings = headings.filter((heading) => {
          if (!hideColumns.includes(heading)) {
            return { id: heading, label: heading };
          }
        });
      }
      return {
        ...item
      };
    });
    headings = [
      ...new Set([...headings.reverse(), ...temp.reverse()].reverse())
    ];
    if (editable) {
      headings = [...headings, 'Operation'];
      if (onlyDisplay) {
        headings = [...onlyDisplay, 'Operation'];
      }
    }
    if (extraActions) {
      headings = [...headings, 'Actions'];
      if (onlyDisplay) {
        headings = [...onlyDisplay, 'Actions'];
      }
    }

    return {
      rows: newData,
      columns: onlyDisplay || headings
    };
  }
  return {
    rows: [],
    columns: []
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  container: {
    minHeight: 340,
    overflowY: 'hidden',
    padding: theme.spacing(0, 1),
    '& .table-font-size tr td.MuiTableCell-root p': {
      fontSize: '14px'
    }
  },
  containerFixedHeight: {
    overflowY: 'auto',
    height: 340,
    padding: theme.spacing(0, 1),
    '& .table-font-size.MuiTableCell-head': {
      fontSize: '14px'
    }
  },
  paperContainer: {
    backgroundColor: 'white'
  },
  loaderContainer: {
    minHeight: 340,
    width: '100%'
  },
  removeBackgroundColor: {
    '& > tr > th': {
      backgroundColor: 'transparent',
      borderTop: `1px solid ${theme.palette.secondary.charcole}`,
      borderBottom: 'none',
      textTransform: 'capitalize'
    }
  },
  dataRow: {
    border: 'none',
    cursor: 'pointer',
    height: theme.spacing(8),
    '& > td': {
      backgroundColor: theme.palette.primary.charcoleLight,
      color: theme.palette.primary.charcole,
      borderBottom: 'none',
      margin: theme.spacing(2, 0),
      '&:first-child': {
        borderRadius: theme.spacing(2, 0, 0, 2)
      },
      '&:last-child': {
        borderRadius: theme.spacing(0, 2, 2, 0)
      }
    }
  },
  whiteDataRow: {
    '& > td': {
      backgroundColor: 'white'
    }
  },
  paperRow: {
    cursor: 'pointer',
    height: theme.spacing(6),
    border: `1px solid ${theme.palette.secondary.charcole}`,
    '& > td': {
      color: theme.palette.primary.charcole,
      padding: theme.spacing(0, 2),
      // borderTop: `1px solid ${theme.palette.secondary.charcole}`,
      // borderBottom: `1px solid ${theme.palette.secondary.charcole}`,
      '&:first-child': {
        borderRadius: theme.spacing(2, 0, 0, 2)
      },
      '&:last-child': {
        borderRadius: theme.spacing(0, 2, 2, 0)
      }
    }
  },
  dummyRow: {
    height: theme.spacing(1)
  },
  labelsHeader: {
    fontSize: '14px'
  },
  date: {
    minWidth: '190px',
    fontSize: '14px'
  },
  operationSection: {
    minWidth: '190px'
  },
  operationSection2: {
    minWidth: '100px'
  }
}));
const TableTextField = ({
  onChange = () => null,
  value,
  label,
  type = 'text',
  setError,
  isError = {}
}) => {
  const handleChangePage = (e) => {
    if (getRegex(label)) {
      const isValid = getRegex(label);
      console.log('test', isValid);
      isValid.test(e.target.value)
        ? delete isError[label]
        : setError({ ...isError, [label]: 'Not valid!' });
    }
    onChange(e);
  };
  return (
    <TextField
      style={{ minWidth: '200px' }}
      type={type}
      // inputProps={{ pattern: getRegex(label) }}
      variant="standard"
      label={getLabels(label)}
      value={
        type === 'date'
          ? dayjs(value).format(constants.date.DATE_FORMAT)
          : value
      }
      onChange={handleChangePage}
      onBlur={handleChangePage}
      helperText={isError?.[label] || ''}
      size="small"
      error={isError?.[label]}
    />
  );
};

const filterEditFields = (onlyEdit, skipEdit, columns) => {
  if (onlyEdit.length > 0) {
    return columns.filter((column) => !onlyEdit.includes(column));
  }
  if (skipEdit.length > 0) {
    return skipEdit;
  }
  return [];
};

const textFieldOnChangeHandler = ({
  e,
  isChecked,
  column,
  multiSelectionKey,
  setMultipleSelectedkey,
  selected,
  multipleSelectedKey,
  modifyRow,
  setModifyRow
}) => {
  selected.includes(isChecked) &&
    multiSelectionKey.includes(column) &&
    setMultipleSelectedkey({
      ...multipleSelectedKey,
      [isChecked]: {
        ...multipleSelectedKey[isChecked],
        [column]: e.target.value
      }
    });
  setModifyRow({ ...modifyRow, [column]: e.target.value });
};
const TableDataCell = (props) => {
  const {
    row = [],
    columns = [],
    classes = {},
    index,
    setMultipleSelectedkey,
    multipleSelectedKey,
    multiSelectionKey = false,
    isCheckBox = false,
    selected,
    skipEdit = [],
    onlyEdit = [],
    setSelected,
    selectionKey,
    isRadio,
    statusMapping,
    statusText,
    attributeMapping,
    tableActions = {
      edit: (val) => {}
    },
    deleteRow = {
      edit: (val) => {}
    },
    editFields = false,
    editRow = () => null,
    isAddingRow = false,
    setIsAddingRow = () => {},
    handleRadioChange = () => {},
    setAllSelected = () => {},
    statusAttribute = [],
    statusTagStyleMapping = {},
    statusTagSize = 'small',
    loader,
    pagination,
    extraActions = false
  } = props;
  const isChecked = selectionKey ? row[selectionKey] : index;
  const [modifyRow, setModifyRow] = useState(row);
  const [isEditing, setIsEditing] = useState(isAddingRow);
  const [editAbleFields, setEditAbleFields] = useState(
    filterEditFields(onlyEdit, skipEdit, columns)
  );
  const [isError, setError] = useState({});

  const handleError = (val, remove = false) => {
    if (remove) {
      delete isError[val];
      setError({ ...isError });
      return;
    }
    setError({ ...isError, ...val });
  };

  useEffect(() => {
    setModifyRow(row);
  }, [loader, pagination.page, pagination.rowsPerPage]);

  useEffect(() => {
    if (Object.keys(isError).length) {
      editRow(true);
      setIsEditing(true);
    }
  }, [isError]);
  return (
    <>
      {isCheckBox && (
        <TableCell padding="checkbox" key={index + '-CheckBox'}>
          <Checkbox
            checked={selected.includes(isChecked)}
            onClick={(e) => {
              e.stopPropagation();
              if (e.target.checked) {
                setSelected([...selected, isChecked]);
                multiSelectionKey &&
                  setMultipleSelectedkey({
                    ...multipleSelectedKey,
                    [isChecked]: {
                      ...multiSelectionKey.reduce(
                        (ac, item) => ({ ...ac, [item]: row[item] }),
                        []
                      )
                    }
                  });
              } else {
                setSelected(selected.filter((item) => item !== isChecked));
                const temp = { ...multipleSelectedKey };
                delete temp[isChecked];
                setMultipleSelectedkey({
                  ...temp
                });
                setAllSelected(false);
              }
            }}
            color="primary"
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
      )}
      {isRadio && (
        <TableCell padding="checkbox" key={index + '-radio'}>
          <Radio
            checked={selected.includes(isChecked)}
            onClick={(e) => {
              e.stopPropagation();
              if (e.target.value) {
                setSelected([isChecked]);
                multiSelectionKey &&
                  setMultipleSelectedkey({
                    [isChecked]: {
                      ...multiSelectionKey.reduce(
                        (ac, item) => ({ ...ac, [item]: row[item] }),
                        []
                      )
                    }
                  });
                handleRadioChange && handleRadioChange(isChecked);
              } else {
                setMultipleSelectedkey({});
                setSelected([]);
              }
            }}
            value={isChecked}
            color="primary"
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
      )}
      {columns.map((column, indx) => {
        const value = row[column];

        if (column === 'Operation') {
          return (
            <TableCell
              className={classes.operationSection}
              key={indx + '-' + index}
            >
              <Grid container spacing={1}>
                {tableActions?.edit !== false && (
                  <Grid item>
                    {(isEditing && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          editRow(false);
                          setIsEditing(false);
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    )) || (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          editRow(true);
                          setIsEditing(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Grid>
                )}
                <Grid item>
                  {isEditing && tableActions?.['submit'] && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        tableActions?.['submit'] &&
                          !Object.keys(isError).length &&
                          tableActions['submit']({
                            modifyRow,
                            index,
                            handleError,
                            isError
                          });
                        editRow(true);
                        setIsEditing(false);
                      }}
                    >
                      <SaveIcon />
                    </IconButton>
                  )}
                </Grid>
                {tableActions?.['delete'] && (
                  <Grid item>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('delete section', tableActions);
                        tableActions?.['delete'] &&
                          tableActions['delete']({ modifyRow, index });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </TableCell>
          );
        }
        if (column === 'Actions') {
          return (
            <TableCell
              className={classes.operationSection2}
              key={indx + '-' + index}
              onClick={(e) => e.stopPropagation()}
            >
              <Grid container spacing={1}>
                {' '}
                {extraActions && extraActions({ modifyRow, index })}
              </Grid>
            </TableCell>
          );
        }
        if (attributeMapping && attributeMapping?.[column]) {
          const attribute = attributeMapping?.[column];
          return (
            (attribute && (
              <TableCell key={indx + '-' + index}>
                {attribute?.[value] || value}
              </TableCell>
            )) || <TableCell key={indx + '-' + column}>-</TableCell>
          );
        }
        if (statusAttribute.includes(column)) {
          return (
            <TableCell key={indx + '-' + index}>
              {(statusMapping && (
                <StatusTag
                  value={Number(value) || value}
                  statusMap={statusMapping}
                  size={statusTagSize}
                  statusText={statusText}
                  colorStyleName={statusTagStyleMapping?.[value]}
                />
              )) || (
                <StatusTag
                  label={value}
                  size={statusTagSize}
                  colorStyleName={statusTagStyleMapping?.[value]}
                  statusText={statusText}
                />
              )}
            </TableCell>
          );
        } else if (constants.date.dateLabel.includes(column)) {
          return (
            <>
              {(isEditing && !editAbleFields.includes(column) && (
                <TableCell key={indx + '-' + index}>
                  <TextField
                    type={'date'}
                    value={dayjs(modifyRow[column]).format(
                      constants.date.DATE_FORMAT
                    )}
                    fullWidth
                    onChange={(e) => {
                      textFieldOnChangeHandler({
                        e,
                        isChecked,
                        column,
                        multiSelectionKey,
                        setMultipleSelectedkey,
                        selected,
                        multipleSelectedKey,
                        modifyRow,
                        setModifyRow
                      });
                    }}
                    variant="standard"
                    label={column}
                    inputProps={{
                      min: dayjs(new Date()).format(constants.date.DATE_FORMAT)
                    }}
                    isError={isError}
                    setError={setError}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
              )) || (
                <TableCell key={indx + '-' + index}>
                  {dayjs(value).isValid() ? getDateFormate(column, value) : '-'}
                </TableCell>
              )}
            </>
          );
        } else {
          return (
            <>
              {(isEditing && !editAbleFields.includes(column) && (
                <TableCell key={indx + '-' + index}>
                  <TableTextField
                    value={modifyRow[column]}
                    fullWidth
                    onChange={(e) => {
                      textFieldOnChangeHandler({
                        e,
                        isChecked,
                        column,
                        multiSelectionKey,
                        setMultipleSelectedkey,
                        selected,
                        multipleSelectedKey,
                        modifyRow,
                        setModifyRow
                      });
                    }}
                    label={column}
                    isError={isError}
                    setError={setError}
                  />
                </TableCell>
              )) || (
                <TableCell key={indx + '-' + index}>
                  {column.format && typeof value === 'number' ? (
                    column.format(value)
                  ) : (
                    <>
                      {(constants.multiLineTextFields.includes(column) &&
                        value?.length > 10 && (
                          <CustomWidthTooltip title={value}>
                            <Typography
                              style={{
                                width: '110px',
                                textDecoration: 'underline overline'
                              }}
                              noWrap={constants.multiLineTextFields.includes(
                                column
                              )}
                              variant="body2"
                            >
                              {value || '-'}
                            </Typography>
                          </CustomWidthTooltip>
                        )) || (
                        <Typography variant="body2">
                          {typeof value === 'number' && !Number.isInteger(value)
                            ? removeDecimal(value)
                            : value || '-'}
                        </Typography>
                      )}
                    </>
                  )}
                </TableCell>
              )}
            </>
          );
        }
      })}
    </>
  );
};
const SimpleTableBody = (props) => {
  const {
    rows,
    columns,
    startIndex,
    endIndex,
    classes,
    handleClick,
    invertColor,
    isCheckBox = false,
    selected,
    setSelected,
    selectionKey,
    isRadio,
    statusMapping,
    statusText,
    attributeMapping,
    paper = false,
    loader
  } = props;
  const [editFields, setEdit] = useState(false);
  const editRow = (val) => {
    setEdit(val);
  };
  return (
    <TableBody>
      {rows.slice(startIndex, endIndex).map((row, index) => {
        return (
          <>
            <TableRow className={classes.dummyRow}></TableRow>
            <TableRow
              hover
              tabIndex={-1}
              key={Object.values(row).join('-')}
              onClick={(event) => !editFields && handleClick(row, index, event)}
              className={`${classes.dataRow} ${
                invertColor ? classes.whiteDataRow : ''
              } ${paper ? classes.paperRow : ''}`}
            >
              <TableDataCell
                row={row}
                index={index}
                columns={columns}
                classes={classes}
                isCheckBox={isCheckBox}
                selected={selected}
                setSelected={setSelected}
                selectionKey={selectionKey}
                isRadio={isRadio}
                statusMapping={statusMapping}
                statusText={statusText}
                attributeMapping={attributeMapping}
                editRow={editRow}
                editFields={editFields}
                {...props}
              />
            </TableRow>
          </>
        );
      })}
    </TableBody>
  );
};
const TableBodyWithAccordion = ({
  rows,
  columns,
  startIndex,
  endIndex,
  classes,
  handleClick,
  invertColor,
  isCheckBox = false,
  selected,
  setSelected,
  selectionKey,
  isRadio,
  statusMapping,
  statusText,
  attributeMapping,
  pagination,
  paper = false
  // DetailComponent = () => (
  //   <>
  //     <div>No Info</div>
  //   </>
  // )
}) => {
  const [open, setOpen] = useState(false);
  //return table body with accordion
  return rows.slice(startIndex, endIndex).map((row, index) => {
    return (
      <>
        <TableRow className={classes.dummyRow}></TableRow>
        <TableRow
          hover
          tabIndex={-1}
          key={index}
          onClick={() => {
            handleClick(row, index);
            if (open !== false) {
              let temp = open;
              setOpen(false);
              if (temp === index) {
                return;
              }
            }
            setOpen(index);
          }}
          className={`${classes.dataRow} ${
            invertColor ? classes.whiteDataRow : ''
          } ${paper ? classes.paperRow : ''}`}
        >
          <TableDataCell
            pagination={pagination}
            row={row}
            index={index}
            columns={columns}
            classes={classes}
            isCheckBox={isCheckBox}
            selected={selected}
            setSelected={setSelected}
            selectionKey={selectionKey}
            isRadio={isRadio}
            statusMapping={statusMapping}
            statusText={statusText}
            attributeMapping={attributeMapping}
          />
        </TableRow>
        {/* {open === index && <DetailComponent />} */}
      </>
    );
  });
};

const getRowPerPageValue = (digit = 0) => {
  if (digit) {
    const rem = (digit % 5 && 5 - (digit % 5)) || 0;
    return digit + rem;
  }
};
export default function CommonTable(props) {
  const {
    tableData = [],
    hideColumns = [],
    onRowClick = () => {},
    headerContent = '',
    isLoading = false,
    orderBy = [],
    totalRecords = 0,
    fetchDataByPage = () => null,
    isRefresh = false,
    invertColor = false,
    isCheckBox = false,
    isRadio = false,
    selectionKey = false,
    trigger = {},
    statusMapping = {
      1: 'Active',
      0: 'In-Active'
    },
    multiSelectionKey = false,
    statusText = false,
    detailedBody = false,
    DetailComponent = false,
    attributeMapping = false,
    editable = false,
    isAddRow = false,
    handleTableSelect = () => {},
    onlyDisplay = false,
    statusAttribute = ['status'],
    displayDownload = false,
    onDownload = () => {},
    paper = false,
    downloadLoader = false,
    initalSelectedData = [],
    extraActions = false,
    initRowsPerPage = 5,
    initRowsPerPageOptions = [5, 10, 15, 20],
    fixedHeightScroll = false,
    downloadEnabled = false
  } = props;
  const classes = useStyles();
  const [isAllSelected, setAllSelected] = useState(false);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: getRowPerPageValue(initRowsPerPage),
    rowsPerPageOptions: initRowsPerPageOptions,
    totalCount: totalRecords || tableData.length
  });
  const [indexVal, setIndexVal] = useState({
    startIndex: 0,
    endIndex: getRowPerPageValue(initRowsPerPage)
  });

  const [loader, setLoader] = useState(false);
  const [selected, setSelected] = React.useState(initalSelectedData);
  const [multipleSelectedKey, setMultipleSelectedkey] = useState({});
  const [tableArrayLength, setTableArrayLength] = useState(tableData.length);
  const handleChangePage = async (event, page) => {
    let startIndex = indexVal.startIndex;
    let endIndex = indexVal.endIndex;
    setLoader(true);
    if (
      tableData.length > pagination.rowsPerPage &&
      tableData.length >= endIndex
    ) {
      startIndex = page * pagination.rowsPerPage;
      endIndex =
        startIndex + pagination.rowsPerPage < tableData.length
          ? startIndex + pagination.rowsPerPage
          : tableData.length + 1;
      setPagination({
        ...pagination,
        page
      });
    } else {
      startIndex = 0;
      endIndex = pagination.rowsPerPage;
      setPagination({
        ...pagination,
        page
      });
      await fetchDataByPage({ page, pageSize: pagination.rowsPerPage });
    }
    setIndexVal({
      startIndex,
      endIndex
    });
    setLoader(false);
  };
  const handleChangeRowsPerPage = async (event) => {
    const rowsPerPage = event.target.value;
    let startIndex = indexVal.startIndex;
    let endIndex = indexVal.endIndex;
    // rowsPerPageValue = rowsPerPage;
    setLoader(true);
    if (tableData.length > rowsPerPage) {
      // startIndex = pagination.page * rowsPerPage;
      endIndex =
        startIndex + rowsPerPage < tableData.length
          ? startIndex + rowsPerPage
          : tableData.length;
      console.log('pagination.page', pagination.page);
      console.log('startIndex', startIndex);
      console.log('endIndex', endIndex);

      const page = Math.floor(
        (pagination.page * pagination.rowsPerPage) / rowsPerPage
      );
      setPagination({
        ...pagination,
        rowsPerPage: rowsPerPage,
        page
      });
    } else {
      startIndex = 0;
      endIndex = rowsPerPage;
      const page = Math.floor(
        (tableData.length * pagination.page) / rowsPerPage
      );
      setPagination({
        ...pagination,
        rowsPerPage: rowsPerPage,
        page
      });
      await fetchDataByPage({ page, pageSize: rowsPerPage });
    }
    setIndexVal({
      startIndex,
      endIndex
    });
    setLoader(false);
  };
  const handleClick = (row, index, e) => {
    onRowClick(row, index, e);
  };
  useEffect(() => {
    if (multiSelectionKey) {
      const initalMultiSelectedKey = {};
      console.log('tableData', tableData);
      tableData.forEach((item) => {
        if (selected.includes(item[selectionKey])) {
          const temp = {};
          multiSelectionKey.forEach((key) => {
            temp[key] = item[key];
          });

          initalMultiSelectedKey[item[selectionKey]] = temp;
        }
      });
      setMultipleSelectedkey({
        ...multipleSelectedKey,
        ...initalMultiSelectedKey
      });
    }
  }, [tableData]);
  useEffect(() => {
    if (isRefresh) {
      setSelected([]);
      setAllSelected(false);
      setMultipleSelectedkey({});
      setPagination({
        page: 0,
        rowsPerPage: getRowPerPageValue(initRowsPerPage),
        rowsPerPageOptions: initRowsPerPageOptions,
        totalCount: totalRecords || tableData.length
      });
      setSelected(initalSelectedData);
    }
  }, [isRefresh]);
  useEffect(() => {
    setPagination({
      page: 0,
      rowsPerPage: getRowPerPageValue(initRowsPerPage),
      rowsPerPageOptions: initRowsPerPageOptions,
      totalCount: totalRecords
    });
  }, [totalRecords]);
  useEffect(() => {
    const { key, callBack } = trigger;
    if (key) callBack({ selected, isAllSelected, multipleSelectedKey });
  }, [trigger.key]);
  useEffect(() => {
    console.log('useEffect Table Data ', tableData);
  }, [tableArrayLength]);
  useEffect(() => {
    if (!loader)
      handleTableSelect({ selected, isAllSelected, multipleSelectedKey });
  }, [selected, multipleSelectedKey]);
  const { rows, columns } = createData(
    tableData,
    hideColumns,
    orderBy,
    editable,
    onlyDisplay,
    extraActions
  );
  const handleOnExport = () => {
    onDownload({
      setLoader: setIsDownloading
    });
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, index) =>
        selectionKey ? n[selectionKey] : index
      );
      if (multiSelectionKey) {
        const temp = {
          ...rows.reduce(
            (acc, item) => ({
              ...acc,
              [item[selectionKey]]: multiSelectionKey.reduce(
                (ac, i) => ({ ...ac, [i]: item[i] }),
                {}
              )
            }),
            {}
          )
        };
        setMultipleSelectedkey(temp);
      }

      setAllSelected(true);
      setSelected(newSelecteds);
      return;
    }
    setAllSelected(false);
    setSelected([]);
    setMultipleSelectedkey({});
  };
  const addNewRow = () => {
    let obj = {};
    setIsAddingRow(false);
    Object.keys(tableData[0]).forEach((i) => {
      if (i === 'insNo') {
        obj[i] = tableData.length + 1;
        return;
      }
      obj[i] = '';
    });
    tableData.push(obj);
    setTableArrayLength(tableData.length);
    setIsAddingRow(true);
    console.log('tableData ----- ', tableData, ' obj ', obj);
  };
  if (!isLoading && tableData.length === 0) {
    return (
      <Grid container xs={12} className={paper && classes.paperContainer}>
        <Grid item xs={12}>
          <Grid item container spacing={3}>
            {headerContent}
          </Grid>
          <Grid
            container
            item
            xs={12}
            className={classes.loaderContainer}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Typography variant="h5">No Data Found</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Grid container xs={12} className={paper && classes.paperContainer}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {headerContent}
          </Grid>
        </Grid>
        {(isLoading && (
          <Grid
            container
            xs={12}
            alignItems="center"
            justifyContent="center"
            className={classes.loaderContainer}
          >
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )) || (
          <Grid item xs={12}>
            <TableContainer
              className={
                (fixedHeightScroll && classes.containerFixedHeight) ||
                classes.container
              }
            >
              <Table className="table-font-size" aria-label="sticky table">
                <TableHead className={classes.removeBackgroundColor}>
                  <TableRow>
                    {isCheckBox && (
                      <TableCell padding="checkbox" key={'checkBoxGrop'}>
                        <Checkbox
                          checked={
                            rows.length > 0 && selected.length === rows.length
                          }
                          onChange={handleSelectAllClick}
                          inputProps={{ 'aria-label': 'select all ' }}
                          color="primary"
                        />
                      </TableCell>
                    )}
                    {isRadio && (
                      <TableCell key={'radio'} padding="checkbox">
                        Select
                      </TableCell>
                    )}
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        className={
                          constants.date.dateLabel.includes(column)
                            ? classes.date
                            : classes.labelsHeader
                        }
                      >
                        {`${getLabels(column)}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {(detailedBody && (
                  <TableBodyWithAccordion
                    rows={rows}
                    columns={columns}
                    startIndex={indexVal.startIndex}
                    endIndex={indexVal.endIndex}
                    classes={classes}
                    handleClick={handleClick}
                    invertColor={invertColor}
                    isCheckBox={isCheckBox}
                    handleSelectAllClick={handleSelectAllClick}
                    selected={selected}
                    setSelected={setSelected}
                    selectionKey={selectionKey}
                    statusMapping={statusMapping}
                    statusText={statusText}
                    isRadio={isRadio}
                    DetailComponent={DetailComponent}
                    attributeMapping={attributeMapping}
                  />
                )) || (
                  <SimpleTableBody
                    {...props}
                    rows={rows}
                    pagination={pagination}
                    columns={columns}
                    startIndex={indexVal.startIndex}
                    endIndex={indexVal.endIndex}
                    classes={classes}
                    handleClick={handleClick}
                    invertColor={invertColor}
                    isCheckBox={isCheckBox}
                    handleSelectAllClick={handleSelectAllClick}
                    selected={selected}
                    setSelected={setSelected}
                    selectionKey={selectionKey}
                    statusMapping={statusMapping}
                    setMultipleSelectedkey={setMultipleSelectedkey}
                    multipleSelectedKey={multipleSelectedKey}
                    statusText={statusText}
                    isAddingRow={isAddingRow}
                    setIsAddingRow={setIsAddingRow}
                    isRadio={isRadio}
                    attributeMapping={attributeMapping}
                    setAllSelected={setAllSelected}
                    statusAttribute={statusAttribute}
                    loader={loader}
                  />
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={pagination.rowsPerPageOptions}
              component="div"
              count={pagination.totalCount || totalRecords || tableData.length}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        )}

        <Grid item xs={12} align="right">
          {displayDownload && (
            <Button
              onClick={handleOnExport}
              color="primary"
              variant="contained"
              startIcon={
                downloadLoader ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  <CloudDownloadIcon />
                )
              }
            >
              Download
            </Button>
          )}
          {downloadEnabled && (
            <Button
              onClick={handleOnExport}
              color="primary"
              variant="contained"
              disabled={isDownloading}
              startIcon={
                isDownloading ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  <CloudDownloadIcon />
                )
              }
            >
              Download
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}
