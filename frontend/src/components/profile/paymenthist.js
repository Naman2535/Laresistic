import React, { useEffect,useState } from 'react'
import './paymenthist.css'

const Paymenthist = (props)=>{
    const [data,setData] = useState([]);
    useEffect(()=>{
        getpaymenthist();
    },[])
    // let data;
    const getpaymenthist=async ()=>{
        // console.warn("hello");
        if(props.id){
        let result = await fetch(`http://localhost:5000/paymenthistory/${props.id}`,{
                headers:{
                 authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            result = await result.json();
            // console.warn(result);
            if(!result.result)setData(result);
            else setData([{date:"--",amount:"--",mode:"--"}]);
        }
    }
    const delpaymenthistory=async ()=>{
        if(JSON.stringify(data)===JSON.stringify([{date:"--",amount:"--",mode:"--"}])){
            return false
        }
        let result = await fetch("http://localhost:5000/delpaymenthistory/"+props.id,{
          method:'delete',
          headers:{
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
      })
      result = await result.json();
      if(result.result==="Done"){
        //   console.log("Payment history delete done")
          setData([{date:"--",amount:"--",mode:"--"}])
      }
      }
    return(
        <div className="editprofile">
            <h4>Payment History</h4>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Mode</th>
                </tr>
                </thead>
                <tbody>
                {/* {console.log(Array.isArray(data))} */}
                {data.map((item,index)=>
                    <tr>
                        <td>{item.date}</td>
                        <td>{item.amount} Rs</td>
                        <td>{item.mode}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <button
        type="delete"
        className="edit-delete"
        onClick={delpaymenthistory}
      >
        Delete History
      </button>
            <button
        type="cancel"
        className="edit-cancel"
        onClick={() => props.setBtn(false)}
      >
        Cancel
      </button>
        </div>
    )
}

export default Paymenthist;