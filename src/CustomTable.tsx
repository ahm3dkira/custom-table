import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Checkbox,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';


import ROLES from './flags';
import { TEST_MODE_NO_AUTH, MAX_CELL_LENGTH } from './config';
import { getConfig, getFetcher } from './config';


type FieldProps = any;

const getFetcherURL = (model: string, searchQuery: any) => getConfig().getGetListURL(model) + '?' + new URLSearchParams(searchQuery).toString();

function getDefaultAccess(storeId: string) {
  const defaultAccessRow = localStorage.getItem('defaultAccess');
  const defaultAccess = defaultAccessRow ? JSON.parse(defaultAccessRow) : {};
  return defaultAccess[storeId] || 0;
}


// TODO: use imports
const getImgSrc = (img: string) => {
  // return img.startsWith('http') ? img : API_HOST + img;
  return img;
}
// import { Tooltip } from '@mui/material';

// import  from '@mui/material/Tooltip';

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ tableProps, enableSelection }: any) {
  return (
    <TableHead>
      <TableRow>
        {enableSelection && (
          <TableCell padding="checkbox">
            <Checkbox />
          </TableCell>
        )}
        {tableProps.map((headCell: any) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'operations' ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER TABLE - STATUS ||============================== //

// const OrderStatus = ({ status }) => {
//   let color;
//   let title;

//   switch (status) {
//     case 0:
//       color = 'warning';
//       title = 'Pending';
//       break;
//     case 200:
//       color = 'success';
//       title = 'Success';
//       break;
//     case 404:
//       title = 'Not Found';
//       color = 'error';
//       break;
//     default:
//       color = 'primary';
//       title = status;
//   }

//   return (
//     <Tooltip title={`Status: ${status}`} arrow>
//       <Stack direction="row" spacing={1} alignItems="center">
//         {/* <Fragment> */}
//         <Dot color={color} />
//         <Typography>{title}</Typography>
//         {/* </Fragment> */}
//       </Stack>
//     </Tooltip>
//   );
// };
function BasicMenu({ extraOperations, row }: { extraOperations: any[], row: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 
  if (extraOperations.length > 2 && extraOperations[0].tooltip === 'Delete' && extraOperations[1].tooltip == 'Edit'){
    // swap them
    let temp = extraOperations[0];
    extraOperations[0] = extraOperations[1];
    extraOperations[1] = temp;
  }

  return (
    <div>
      <div
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{
          cursor: 'pointer'
        }}
      >
        <MoreVertIcon color='primary'
         />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {extraOperations.map((item: any, i: number)=>{
          return (

            <MenuItem key={i} onClick={()=>{
              item.handler(row)
              handleClose()
            }}>
              {/* <item.icon /> */}
            
            {item.tooltip || "action"}</MenuItem>
          )

        })}
        {/* <MenuItem onClick={handleClose}>Edit</MenuItem> */}
      </Menu>
    </div>
  );
}

function Operations({ storeId, row, basicMenu, handleEdit, handleDelete, extraOperations = [] }: {storeId:any, row: any, basicMenu: boolean, handleEdit: (row: any) => void, handleDelete: (row: any) => void, extraOperations?: any[] }) {
  
  // ======================================
  // TODO: uncomment this
  // const menuXD = useSelector((state: any) => state.menu);
  const menuXD = {
    openComponentAccess: getDefaultAccess(storeId)
  }

  extraOperations = extraOperations.filter((operation: any) => {
    return !!(menuXD.openComponentAccess & operation.accessFlag);
  });
  // let crudOperations = [];
  if (TEST_MODE_NO_AUTH || menuXD.openComponentAccess & ROLES.EDIT) {
    extraOperations = [{ icon: EditIcon, tooltip: 'Edit', handler: handleEdit }].concat(extraOperations);
    // extraOperations.push({ icon: EditIcon, tooltip: 'Edit', handler: handleEdit });
  }
  if (TEST_MODE_NO_AUTH || menuXD.openComponentAccess & ROLES.DELETE) {
      extraOperations = [{ icon: DeleteIcon, tooltip: 'Delete', handler: handleDelete }].concat(extraOperations)
    // extraOperations.push({ icon: DeleteIcon, tooltip: 'Delete', handler: handleDelete });
  }
  // extraOperations append at the start
  if (basicMenu){
    return (
      <BasicMenu row={row} extraOperations={extraOperations} />
    );
  }
  return (
    <Stack direction="row-reverse" spacing={2} alignItems="center" justifyContent="flex-start">
      {extraOperations.map((operation: any, index: number) => {
        return (
          <Tooltip key={index} title={operation.tooltip || ''} arrow>
            <IconButton
              disabled={operation.disable?operation.disable(row):false}
              size="small"
              color={operation.color || 'primary'}
              onClick={() => {
                operation.handler(row);
              }}
            >
              <operation.icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

 function CustomTable({
  tableProps,
  search,
  handleEdit,
  handleDelete,
  handleView,
  extraOperations,
  storeId,
  customListRoute = false,
  noPagination = false,
  // enableSelect = false,
  // enableSelection = true,
  enableSelection = false,
  rowDoubleClick = () => {},
  // () => // console.log('double click')
  basicMenu = false
}: any) {
  const fetcher = getFetcher(); 
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const defaultSearch = getConfig().PAGINATION_TYPE === "type2"? {pageNumber: 1}: {page: 1}
  const [searchQuery, setSearchQuery] = useState({ ...defaultSearch, pageSize: pageSize, ...search });
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<any>([]); // State to store selected rows

  const handleSelectRow = (event: React.MouseEvent<unknown>, row: any) => {
    if (!enableSelection) return;
    const selectedIndex = selectedRows.indexOf(row);
    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }
    // // console.log('newSelected', newSelected);
    setSelectedRows(newSelected);
  };

  // access
  if (!storeId) {
    console.error('storeId is required');
    return <Box>Error: storeId is required</Box>;
  }
  if (!tableProps || tableProps.length === 0) {
    console.error('tableProps is required');
    return <Box>Error: tableProps is required</Box>;
  }
  if(!TEST_MODE_NO_AUTH && !getDefaultAccess(storeId)) {
    console.error('Access denied');
    return <Box>Error: Access denied</Box>;
  }

  useEffect(() => {
    if (data && !isLoading) {
      // Data is ready
      // setTotal(data.result.total);
      // setPage(data.result.page - 1);
      // setPageSize(data.result.pageSize);
      // setTotal(data.total);
      if (getConfig().PAGINATION_TYPE==="type2"){
        setTotal(data.totalCount);
        setPage(data.pageNumber - 1);
        setPageSize(data.pageSize);
      } else {
        setTotal(data.total);
        setPage(data.page - 1);
        setPageSize(data.pageSize);
      }
      // setPage(data.page - 1);

    } else if (error) {
      // Handle error state if needed
      console.error('Error loading data:', error);
    }

    // Additional cleanup or side effects if necessary
  }, [data, error, isLoading]);

  useEffect(() => {
    // console.log('searchQuery', searchQuery);

    let fetcherURL = getFetcherURL(storeId, {
      ...searchQuery,
      ...search
    });
    if (customListRoute) {
      // fetcherURL = API_HOST + customListRoute + '?' + new URLSearchParams(searchQuery).toString();
      fetcherURL = customListRoute + '?' + new URLSearchParams(searchQuery).toString();
    }

   
    fetcher({
      url: fetcherURL,
      method: 'GET',
      // params: searchQuery
    }).then((response: any) => {
        // // console.log('data', data);
        if (noPagination) {
          setData(response);
        }
        else {
          setData(storeId==="user"?response:response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setError(error);
        setIsLoading(false);
      });
  }, [searchQuery, search]);

  const accessFlag = getDefaultAccess(storeId);


  const handleChangePage = (event: unknown, newPage: number) => {
    if(getConfig().PAGINATION_TYPE==="type2"){

      setSearchQuery({ ...search, pageNumber: newPage + 1, pageSize: pageSize });
    }else{
      setSearchQuery({ ...search, page: newPage + 1, pageSize: pageSize });

    }
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(getConfig().PAGINATION_TYPE==="type2"){

    setSearchQuery({ ...search, pageNumber: 1, pageSize: parseInt(event.target.value) || 10 });
    } else {
      setSearchQuery({ ...search, page: 1, pageSize: parseInt(event.target.value) || 10 });
    }
  };
  let oprationsProps = tableProps;
  if (accessFlag === 1 && !TEST_MODE_NO_AUTH) {
    oprationsProps = tableProps.filter((headCell: any) => headCell.id !== 'operations');
  }
  if (!data && !error) {
    // Data is still loading, show loading state
    return <div>Loading...</div>;
  }

  if (error || data?.code === 7) return <div>Error</div>;

  const items = data?.data || data?.applications || [];

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead tableProps={oprationsProps} enableSelection={enableSelection} />
          <TableBody>
            {/* {stableSort(terminals, getComparator(order, orderBy)).map((row, index) => { */}
            {/* {data?.result?.items?.map((row: any, index: number) => { */}
            {items?.map((row: any, index: number) => {
              // const isItemSelected = isSelected(row.id);
              const isItemSelected = selectedRows.indexOf(row) !== -1;
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleSelectRow(event, row)} // Call handleSelectRow on row click
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id || index}
                  selected={isItemSelected}
                  onDoubleClick={()=>rowDoubleClick(row)}
                >
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                  )}

                  {tableProps.map((headCell: any) => {
                    if (headCell.id === 'operations') {
                      // TODO: uncomment this
                      // if (menuXD.openComponentAccess === 1 && !TEST_MODE_NO_AUTH) return null;

                      return (
                        <TableCell align="right" key={headCell.id}>
                          <Operations
                            storeId={storeId}
                            row={row}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            // TODO: handleView={handleView}
                            extraOperations={extraOperations}
                            basicMenu={basicMenu}
                          />
                        </TableCell>
                      );
                    }
                    // if (headCell.prop === 'gender') {
                    //   return (
                    //     <TableCell key={headCell.id} align="left">
                    //       {row[headCell.prop]===0 ? 'Male' : 'Female'}
                    //     </TableCell>
                    //   );
                    // }
                    if (headCell.type === 'select') {
                      return (
                        <TableCell key={headCell.id} align="left">
                          {headCell.options.find((option: any) => option.value === row[headCell.prop])?.label || row[headCell.prop]}
                        </TableCell>
                      );
                    }
                    if (headCell.type === 'date') {
                      return (
                        <TableCell key={headCell.id} align="left">
                          {new Date(row[headCell.prop]).toLocaleDateString()}
                        </TableCell>
                      );
                    }
                    if (headCell.type === 'boolean') {
                      return (
                        <TableCell key={headCell.id} align="left">
                          {row[headCell.prop] ? 'Yes' : 'No'}
                        </TableCell>
                      );
                    }
                    if (headCell.type === 'img') {
                      return (
                        <TableCell key={headCell.id} align="left">
                          <img src={getImgSrc(row[headCell.prop])} alt={row[headCell.prop]} style={{ width: '40px', height: '40px' }} />
                        </TableCell>
                      );
                    }

                    if (headCell.type === 'url') {
                      if (!row[headCell.prop]) {
                        return <TableCell key={headCell.id} align="left">—</TableCell>;
                      }
                      if (row[headCell.prop].startsWith('http') || row[headCell.prop].startsWith('https')) {
                        return (
                          <TableCell key={headCell.id} align="left">
                            <Link href={row[headCell.prop]} target="_blank" rel="noopener" underline="hover">
                                {row[headCell.prop].length > 30 ? `${row[headCell.prop].slice(0, 30)}...` : row[headCell.prop]}
                              </Link>
                          </TableCell>
                        );
                      }
                      // continue; // Skip rendering if the URL is not valid
                    }

                    // applicationDocuments
                    if (headCell.id === 'applicationDocuments') {
                      return (
                        <TableCell key={headCell.id} align="left">
                          {row[headCell.prop]?.map((doc: any, index: number) => (
                            // <div key={index}>{doc.documentType || `Document ${index + 1}`}</div>
                            <div key={index}>
                              {/* <a href={(doc.fileUrl || '#')} target="_blank" rel="noopener noreferrer">
                                {doc.documentType || `Document ${index + 1}`}
                              </a> */}
                               <Link href={doc.fileUrl} target="_blank" rel="noopener" underline="hover">
                                  {doc.documentType || `Document ${index + 1}`}
                                </Link>
                            </div>
                          ))}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={headCell.id} align="left">
                        {/* {row[headCell.prop]} */}
                        {/* TODO: max 20 chars */}
                         <Tooltip title={typeof row[headCell.prop] === 'string' ? row[headCell.prop] : ''} arrow>

                          {typeof row[headCell.prop] === 'string' && row[headCell.prop].length > MAX_CELL_LENGTH
                            ? row[headCell.prop].substring(0, MAX_CELL_LENGTH) + '...'
                            : row[headCell.prop]}

                          </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {!noPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={pageSize || 10}
          page={page || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
}


export default CustomTable;