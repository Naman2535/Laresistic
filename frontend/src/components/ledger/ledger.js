import React from 'react';
import { PDFViewer,pdf } from '@react-pdf/renderer';
import TablePDF from './Table';
import './ledger.css'
import { useLocation } from 'react-router-dom';
import saveAs from 'file-saver'

const App = () => {
  var dnt = new Date();
  const location = useLocation();
  const saveFile = () => {
    // This does the trick!
    pdf(<TablePDF datalist={location.state.datalist} shop = {location.state.shop} billlist = {location.state.billlist} />)
      .toBlob()
      .then((blob) => saveAs(blob, `${location.state.shop.name.toString().replace(' ','-')}_ledger//(${dnt.toLocaleDateString()})/(${dnt.toLocaleTimeString()}).pdf`));
  }
  return (
    <div className='divcheck'>
      <button className='buttstyle1' onClick={saveFile}>Download</button>
      <PDFViewer width="100%" height="100%" >
        {/* {console.warn(location.state.datalist)} */}
        <TablePDF datalist={location.state.datalist} shop = {location.state.shop} billlist = {location.state.billlist} />
      </PDFViewer>
    </div>
  );
};

export default App;
