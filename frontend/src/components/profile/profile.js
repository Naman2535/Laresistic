import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Paymenthist from './paymenthist';
// import Ledger from '../ledger/ledger'
import './profile.css';

const Profile = () => {
  const params = useParams();
  const [pendinglist, setPendinglist] = useState([]);
  const [clearlist, setClearlist] = useState([]);
  const [billid, setBillid] = useState("");
  const [btn, setBtn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getdetails();
    // getpending();
  }, [])
  const [shopdetails, setShopdetails] = useState({ name: "", address: "", mobile: "", route: "", pendingamt: 0 });
  const [pendbutt, setPendbutt] = useState(false);
  const [allbutt, setAllbutt] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////
  const getdetails = async () => {
    // let key = event.target.value;
    if (params.id) {
      let result = await fetch(`http://localhost:5000/profile/${params.id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      result = await result.json();
      if (result.name) {
        setShopdetails(result);
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const getpending = async () => {
    setAllbutt(false);
    setPendbutt(true);
    let result = await fetch("http://localhost:5000/pendingbill", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
      body: JSON.stringify({
        shopid: params.id,
        clear: false
      })
    });
    result = await result.json();
    if (result.result) {
      setPendinglist([]);
    }
    else setPendinglist(result);
    // console.warn("hi");
    // console.warn(pendinglist);
  };
  ///////////////////////////////////////////////////////////////////////////////////

  const clearbill = async () => {
    setAllbutt(true);
    setPendbutt(false);
    let result = await fetch("http://localhost:5000/pendingbill", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
      body: JSON.stringify({
        shopid: params.id,
        clear: true
      })
    });
    result = await result.json();
    if (result.result) {
      setClearlist([]);
    }
    else setClearlist(result);
    // console.warn("hi");
    // console.warn(pendinglist);
  };

  ///////////////////////////////////////////////////////////////////////////////////

  const addpayment = (id, date, amountleft, amount) => {
    navigate('/payment', {
      state: {
        shopdetail: shopdetails,
        billdetail: {
          billid: id,
          billdate: date,
          billamountleft: amountleft,
          billamount: amount
        }
      }
    })
  }
  //////////////////////////////////////////////////////////////////////////////////
  const getledger = async () => {
    // console.warn(params.id);
    // console.warn("checking id");
    let val = params.id;

    ////////////////////Payment fetching
    let data;
    let result = await fetch(`http://localhost:5000/ledger/${val}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
    result = await result.json();
    if (result.result) {
      console.warn("hi res");
      data = [
        {
          billdate: "--",
          billamt: "--",
          amount: "--",
          date: "--",
          time: "--",
          mode: "--"
        }
      ];
    } else {
      console.warn("hi");
      data = result;
    }
    /////////////////billlist fetching
    let billlist = await fetch("http://localhost:5000/pendingbill", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
      body: JSON.stringify({
        shopid: params.id,
      })
    });
    billlist = await billlist.json();
    if (billlist.result) {
      billlist = [];
    }
    navigate('/ledger/' + params.id, {
      state: {
        datalist: data,
        shop: shopdetails,
        billlist: billlist,
      }
    })
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const paymenthistory = (id) => {
    setBillid(id);
    setBtn(true);
  }
  ///////////////////////////////////////////////////////////////////////////////////
  const delbill = async (id) => {
    let result = await fetch("http://localhost:5000/delbill/" + id, {
      method: 'delete',
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
    result = await result.json();
    if (result) {
      console.log("Bill deleted successfully");
      clearbill()
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  const addbill = () => {
    navigate('/bills/addbill', {
      state: {
        shopname: shopdetails.name
      }
    })
  }
  ////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {btn ? <Paymenthist id={billid} setBtn={setBtn} /> : null}
      <div className="mainprofile">
        <div className="profile">
          <div className='detail'>
            <img className='img' src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" alt="profilepic" />
            <h5>{shopdetails.name}</h5>
            <h6>Address : {shopdetails.address}</h6>
            <h6>Mobile : {shopdetails.mobile}</h6>
            <h6>Route No. : {shopdetails.route}</h6>
            <h5>Pending Amount : {shopdetails.pendingamt} Rs</h5>
          </div>
        </div>
        <div className="buttdiv">
          <div className="butt" onClick={addbill}>Add Bill</div>
          <div className="butt" onClick={getpending}>Pending Bills</div>
          <div className="butt" onClick={clearbill} >Cleared Bills</div>
          <div className="butt" onClick={getledger}>Ledger</div>
        </div>
        <div className={pendbutt ? 'pending' : 'secret'}>
          <div className="scrolldivpro">
            <table>
              <thead>
                <tr>
                  <th className='serialprofile'>S. No</th>
                  <th>Bill Date</th>
                  <th>Bill Amount</th>
                  <th>Pending Amount</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {pendinglist.length > 0 && pendbutt ? pendinglist.map((item, index) =>
                  <tr>
                    <td className="serialprofile">{index + 1}</td>
                    <td className='namecursor' onClick={() => addpayment(item._id, item.date, item.amountleft, item.amount)}>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{item.amountleft}</td>
                    <td><button className='deleteprobutton updatepro' onClick={() => paymenthistory(item._id)} >Payment History</button></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            {pendinglist.length > 0 && pendbutt ? null : <h1 id="nores">No Pending Bill</h1>}
          </div>
        </div>
        <div className={allbutt ? 'pending' : 'secret'}>
          <div className="scrolldivpro">
            <table>
              <thead>
                <tr>
                  <th className='serialprofile'>S. No</th>
                  <th>Bill Date</th>
                  <th>Bill Amount</th>
                  <th>Pending Amount</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {clearlist.length > 0 && allbutt ? clearlist.map((item, index) =>
                  <tr>
                    <td className="serialprofile">{index + 1}</td>
                    <td className='namecursor' onClick={() => addpayment(item._id, item.date, item.amountleft, item.amount)}>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{item.amountleft}</td>
                    <td><button className='deleteprobutton updatepro' onClick={() => paymenthistory(item._id)} >Payment History</button><button className='deleteprobutton' onClick={() => delbill(item._id)}>Delete Bill</button></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            {clearlist.length > 0 && allbutt ? null : <h1 id="nores">No Bill Found</h1>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;