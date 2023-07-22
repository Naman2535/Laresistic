import React, { useState } from 'react'
import saveAs from 'file-saver'
import './detail.css'
const Details = () => {
    // const navigate = useNavigate();
    const [category,setCategory] = useState("ALL");
    const [total,setTotal] = useState(0);
    const [butt,setButt] = useState(false);
    const calculate = async ()=>{
        let obj;
        console.log(category);
        if(category==='ALL'){
            obj = {};
        }else{
            obj = {route:category};
        }
        let result = await fetch("http://localhost:5000/shops",{
            method: 'post',
          headers:{
            'Content-Type':'application/json',
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          },
          body:JSON.stringify(obj)
        });
        result = await result.json();
        // console.warn(result)
        if(result.result){
            console.log(result.result)//toast
            setTotal(0);
        }
        else{
            let sum=0;
            for (let index = 0; index < result.length; index++) {
                sum+= result[index].pendingamt;
                
            }
            setTotal(sum);
        }
        setButt(true);
    }
    const backup = () => {
        const back = ['shops', 'bills', 'pay'];
        back.forEach(backcall)
    }
    const backcall = async (val) => {
        let response = await fetch(`http://localhost:5000/backup/${val}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        // console.warn(response.headers)
        response = await response.text();
        if (response.slice(2, 8) === "result") {
            response = await JSON.parse(response);
            console.warn(response.result);
            return;
        }
        const date = new Date();
        var blob = (new Blob([response],
            { type: 'text/csv;encoding:utf-8' }))
        await saveAs(blob, val + date.toDateString() + date.toLocaleTimeString() + ".csv");
    }
    return (
        <div>
            <div className="backup">
                <div className="left">
                    <h1>BACKup</h1>
                    <h5>To secure your bussiness Be sure to backup</h5>
                    <div className='detailbutt' onClick={backup}>Backup</div>
                </div>
                <div className="right">
                    <img src="https://res.cloudinary.com/dhtb16f8u/image/upload/v1687871338/Daco_4516940_dwu1ba.png" alt="backupicon" />
                </div>
            </div>
            <div className="backup backup2">
                <div className="left2">
                    <h1>Calculate</h1>
                    <label className='label' htmlFor="calculation" >Choose Category</label>
                    <select className='inputselect' name="calculation" id="calculation"onChange={(e)=>setCategory(e.target.value)}>
                    <option value="ALL">ALL</option>
                    <option value="1">Route 1</option>
                    <option value="2">Route 2</option>
                    <option value="3">Route 3</option>
                    <option value="4">Route 4</option>
                    <option value="5">Route 5</option>
                    <option value="6">Route 6</option>
                    <option value="7">Route 7</option>
                    <option value="8">Route 8</option>
                    <option value="9">Route 9</option>
                    <option value="10">Route 10</option>
                    <option value="Others">Others</option>
                    </select>
                    <div className={"calbutt"} onClick={calculate}>
                        Calculate
                    </div>
                    <h2 className={butt?'':'hide'}>Total : {total}.00 Rs</h2>

                </div>
                
            </div>
        </div>
    )
}

export default Details;