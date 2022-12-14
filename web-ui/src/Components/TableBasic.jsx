import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function TableBasic({columnHeaders=null, data=null, align="center",sxTableContainer={}}) {
  let tableHead = null
  let tableBody = null

  sxTableContainer.borderRadius = sxTableContainer.borderRadius ?? 2;
  sxTableContainer.boxShadow = sxTableContainer.boxShadow ?? 0;

  if (data != null){
    tableBody = (<TableBody>
      {data.map((row, rowIdx) => {
        let rowKeys = Object.keys(row);
        return (<TableRow
          key={rowIdx}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
        {
          rowKeys.map((rk,i)=>{
            let backgroundColor = null
            if (rk.includes('empty'))
              backgroundColor = '#f2f2f2'
            let cell = (<TableCell key={i} align={align} sx={{backgroundColor:backgroundColor}}>{row[rk]}</TableCell>)
            if (rk=='groupTitle')
              cell = (<TableCell key={i} align={align} sx={{fontWeight:'bold',paddingTop:3, fontSize:20, backgroundColor:'#f2f2f2'}}>{row[rk]}</TableCell>)
            return cell
          })
        }
        </TableRow>
      )}
      )}
    </TableBody>)
  }
  if (columnHeaders!=null){
    tableHead = (<TableHead>
      <TableRow>
        {
          columnHeaders.map((colHeader,k)=>{
            return (<TableCell sx={{backgroundColor:'#CEECF2',fontWeight: 'fontWeightBold' }} key={k} align={align}>{colHeader}</TableCell>)
          })
        }
      </TableRow>
    </TableHead>)
  }
  return (
    <TableContainer component={Paper} sx={sxTableContainer}>
      <Table sx={{ minWidth: 50 }} size="small" aria-label="a dense table">
        {tableHead}
        {tableBody}
      </Table>
    </TableContainer>
  );
}
