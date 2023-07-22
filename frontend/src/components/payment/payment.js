import React, { useState } from 'react'
import './payment.css'
import { useNavigate,useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Autocomplete from 'react-autocomplete';
// import { ConnectionStates } from 'mongoose';
const toast =(e)=>{
    return(
        <span className='span'><h4>{e}</h4></span>
    )
}
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


const Payment = ()=>{
    const [shopname,setShopname] = useState("");
    const [shoppending,setShoppending] = useState(); // for updating prending amt in shop
    const [shopid,setShopid] = useState("");
    const [billdate,setBilldate] = useState("");
    const [amount,setAmount] = useState();
    const [billid,setBillid] = useState("");
    const [amtleft,setAmtleft] = useState(0);
    const [billamt,setBillamt] = useState();
    const [shoplist, setShoplist] = useState([]);
    const [pendinglist, setPendinglist] = useState([]);
    const [error,setError] = useState(false);
    const [tick,setTick] = useState(false);
    const payoptions = [{option :"Cash",_id:"1"},{option :"Cheque",_id:"2"},{option :"Phonepe/others apps",_id:"3"},{option :"Other",_id:"4"}]
    const [payop,setPayop] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

////////////////////////////////////////////////////////////////////////////
    const addpayment = async ()=>{
        if(!shopname || !billdate || !amount){
            setError(true);
            alert("Some Fields are empty!!")
            return false;
        }
        // console.warn(shopname,billdate)
        if(amount>amtleft){
            setTick(true);
            return false;
        }
        let obj;
        if(amount-amtleft===0){
            obj = {
                amountleft : 0,
                clear : true
            }
        }else{
            obj = {
                amountleft : amtleft-amount
            }
        }
        let result = await fetch(`http://localhost:5000/updatebill/${billid}`,{
            method:'put',
            body:JSON.stringify(obj),
            headers:{
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        setAmtleft(amtleft-amount);
        ///////////////////////////////////////////////////billadded
        // console.warn(shopid);
        result = await fetch("http://localhost:5000/addpayment", {
            method: "post",
            body: JSON.stringify({ shopid: shopid, billid:billid, amount,billdate:billdate, billamt: billamt,date : getDate(), mode : payop}),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
        });
        result = await result.json();
        // console.warn(result)
        /////////////////////////////////////////////////payment added
        let result1 = await fetch(`http://localhost:5000/shop/${shopid}`,{
            method:'put',
            body:JSON.stringify({pendingamt:Number(shoppending)-Number(amount)}),
            headers:{
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result1 = await result1.json()
        // console.warn(result)
        setAmount(0) ////////////////////toast
    }
////////////////////////////////////////////////////////////////////////
    useEffect(()=>{
        // location.state? console.warn(location.state.shopdetail,location.state.billid):console.warn("You came directly")
        if(location.state){
            setdetails();
        }
        else{
            getshops();
        }
    },[]);
    ///////////////////////////////////////////////////////////////////
    const getshops = async () => {
        let result = await fetch("http://localhost:5000/shops", {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        // console.warn(result.status,typeof(result.status))
        if(result.status==401){
            navigate("/login",{
                state:{
                    session:true
                }
            });
        }
        result = await result.json();
        
        
        setShoplist(result);
    };
////////////////////////////////////////////////////////////////////////
    const setdetails=()=>{
        setShopname(location.state.shopdetail.name);
        setShopid(location.state.shopdetail._id);
        setBilldate(location.state.billdetail.billdate);
        setBillid(location.state.billdetail.billid);
        setAmtleft(location.state.billdetail.billamountleft);
        setBillamt(location.state.billdetail.billamount);
        setShoppending(location.state.shopdetail.pendingamt)
    }
/////////////////////////////////////////////////////////////////////////

const getshop= (val)=>{
    setShopname(val);
    const selectobj = shoplist.find((item)=> item.name===val)
    setShoppending(selectobj.pendingamt)
    // console.log(val);
    // setTick(true);
    getbilllist(val);
}
/////////////////////////////////////////////////////////////////////////

const getbilllist= async(val)=>{
    // if(pendinglist.length!==0) return false;
    const selectobj = shoplist.find((item)=> item.name===val)
    setShopid(selectobj._id);
    // console.warn(selectobj._id)
    let result = await fetch("http://localhost:5000/pendingbill",{
            method: 'post',
          headers:{
            'Content-Type':'application/json',
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          },
          body:JSON.stringify({
            shopid:selectobj._id,
            clear:false
          })
        });
        result = await result.json();
        // console.warn(result)
        if(result.result){
            setPendinglist([]);
        }
        else setPendinglist(result);

}

/////////////////////////////////////////////////////////////////////////
const getbilldate=(val)=>{
    setBilldate(val);
    const selectobj = pendinglist.find((item)=> item.date===val)
    setAmtleft(selectobj.amountleft);
    setBillamt(selectobj.amount)
    setBillid(selectobj._id);
    // console.warn(selectobj)
}
/////////////////////////////////////////////////////////////////////////
    return(
        <>
        <div className={location.state?'payment':"hidden"}>
            <h1 className='h1'>Add Payment</h1>
            <input className='inputstyle' type="text" placeholder='Enter shopname' value={shopname} onChange={(e)=>{setShopname(e.target.value.toUpperCase())}} />
            {error && !shopname && toast("Please enter valid Shopname")}

            <input className='inputstyle' type="text" placeholder='Enter Billdate' value={billdate} onChange={(e)=>{setBilldate(e.target.value.toUpperCase())}} />
            {error && !billdate && toast('Please enter valid Date')}
            <input className='inputstyle' type="text" placeholder={'Enter Bill Amount (Max Rs: '+ amtleft+' Rs)'} value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
            {(error && !amount && toast('Please enter amount'))||(tick && toast("You can't enter more than "+amtleft+" Rs in this bill"))}
            <div className="autocomplete-wrapper">    
            <Autocomplete
                    value={payop}
                    items={payoptions}
                    getItemValue={item => item.option}
                    shouldItemRender={(item, value) => item.option.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item._id}>
                            {item.option}
                        </div>
                    }
                    onChange={(e) => setPayop(e.target.value)}
                    onSelect={(val)=>setPayop(val)}
                    inputProps={{ placeholder: "Enter Payment mode" }}
                />
                {/* {(error && !payop && toast('Please Payment option'))} */}
                </div>
            <button className='button' onClick={addpayment}>Add Payment</button>
        </div>
        <div className={location.state?'hidden':"payment"} >
        <h1 className='h1'>Add Payment</h1>
        <div className="autocomplete-wrapper">
                <Autocomplete
                    value={shopname}
                    items={shoplist}
                    getItemValue={item => item.name}
                    shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item._id}>
                            {item.name}
                        </div>
                    }
                    onChange={(e) => setShopname(e.target.value)}
                    onSelect={(val)=>getshop(val)}
                    inputProps={{ placeholder: "Enter Shop name" }}
                />
            </div>
        <div className="autocomplete-wrapper">
                <Autocomplete
                    onfocus = {getbilllist}
                    value={billdate}
                    items={pendinglist}
                    getItemValue={item => item.date}
                    shouldItemRender={(item, value) => item.date.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item._id}>
                            {item.date}
                        </div>
                    }
                    onChange={(e) => setBilldate(e.target.value)}
                    onSelect={(val)=>getbilldate(val)}
                    inputProps={{ placeholder: "Enter Bill Date" }}
                />
            </div>
            {/* {error && !billdate && toast('Please enter valid Date')} */}
            <input className='inputstyle' type="Number" placeholder={'Enter Bill Amount (Max Rs: '+ amtleft+' Rs)'} value={amount} onChange={(e) => { setAmount(e.target.value) }} />
            {tick && toast("You can't enter more than "+amtleft+" Rs in this bill")}
            <div className="autocomplete-wrapper">
            <Autocomplete
                    value={payop}
                    items={payoptions}
                    getItemValue={item => item.option}
                    shouldItemRender={(item, value) => item.option.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item._id}>
                            {item.option}
                        </div>
                    }
                    onChange={(e) => setPayop(e.target.value)}
                    onSelect={(val)=>setPayop(val)}
                    inputProps={{ placeholder: "Enter Payment mode" }}
                />
                {/* {(error && !payop && toast('Please Payment option'))} */}
                </div>
        <button className='button' onClick={addpayment}>Add Payment</button>
        </div>
        </>
    )
}

export default Payment;