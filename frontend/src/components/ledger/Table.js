import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  block:{
    display:'block'
  },
  headingrow:{
    display:'flex',
    flexDirection:'row'
  },
  hedaing:{
    fontSize:12,
    width:'33%',
    textAlign:'center',
    textDecoration:'underline',
    marginTop:'3%',
    marginBottom:'3%'
  },
  hedaingadd:{
    fontSize:8,
    width:'60%',
    textAlign:'right',
  },
  headaddview:{
    // width:'80%',
    marginTop:'3%',
    // marginBottom:'3%',
    marginRight:'6%',
    display:'flex',
    flexDirection:'column'
  },
  table: {
    width: '100%',
    fontSize:8,
    marginTop:"2%"
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: '0.25%',
    paddingBottom: "0.25%",
  },
  header: {
    borderTop: 'none',
  },
  bold: {
    fontWeight: 'bold',
  },
  // So Declarative and unDRY 👌
  row1: {
    width: '20%',
    paddingRight:'0.5%',
    paddingLeft:'0.5%',
    textAlign:'center'
  },
  row2: {
    width: '20%',
    textAlign:'center'
  },
  row3: {
    width: '20%',
    textAlign:'center'
  },
  row4: {
    width: '20%',
    textAlign:'center'
  },
  row5: {
    width: '20%',
    textAlign:'center'
  },
  row6: {
    width: '33%',
    textAlign:'center'
  },
});
function getDate() {
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  if(month.toString().length === 1) {
       month = '0'+month;
  }
  if(day.toString().length === 1) {
       day = '0'+day;
  }   
  var dateTime = day+'/'+month+'/'+year;   
   return dateTime;
}

function TablePDF(props){
  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.headingrow}>
        <Text style={styles.hedaing}>Ledger : {getDate()}</Text>
        {/* <View style={styles.block}> */}
        <View style = {styles.headaddview}>
          <Text style={styles.hedaing}>{props.shop.name}</Text>
          <Text style={styles.hedaing}>Pending amount : {props.shop.pendingamt}</Text>
        </View>
        {/* </View> */}
        <View style = {styles.headaddview}>
        <Text style={styles.hedaingadd}>{props.shop.address}</Text>
        <Text style={styles.hedaingadd}>{props.shop.mobile}</Text>
        </View>
      </View>
      <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text style={styles.row6}>Bill Date</Text>
        <Text style={styles.row6}>Bill Amt</Text>
        <Text style={styles.row6}>Pending Amount</Text>
      </View>
      {/* {console.warn(props.datalist)} */}
      {props.billlist.map((row, i) => (
        <View key={i} style={styles.row} wrap={false}>
          <Text style={styles.row6}>{row.date}</Text>
          <Text style={styles.row6}>{row.amount}.00 Rs</Text>
          <Text style={styles.row6}>{row.amountleft}.00 Rs</Text>
        </View>
      ))}
    </View>
    <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text style={styles.row1}>Bill Date</Text>
        <Text style={styles.row2}>Bill Amt</Text>
        <Text style={styles.row3}>Payment Amount</Text>
        <Text style={styles.row4}>Payment Date</Text>
        <Text style={styles.row5}>Payment Type</Text>
      </View>
      {/* {console.warn(props.datalist)} */}
      {props.datalist.map((row, i) => (
        <View key={i} style={styles.row} wrap={false}>
          <Text style={styles.row1}>{row.billdate}</Text>
          <Text style={styles.row2}>{row.billamt}.00 Rs</Text>
          <Text style={styles.row3}>{row.amount}.00 Rs</Text>
          <Text style={styles.row4}>{row.date}</Text>
          <Text style={styles.row5}>{row.mode}</Text>
        </View>
      ))}
    </View>
      </Page>
    </Document>
  );
};

export default TablePDF;
