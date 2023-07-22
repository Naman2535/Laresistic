import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./bill.css";
import Autocomplete from 'react-autocomplete';

const toast = (e) => {
    return (
        <span className='span'>{e}</span>
    )
}

// function rendershopname(state, val) {
//     return (
//         state.title.toLowerCase().indexOf(val.toLowerCase()) !== -1
//     );
// }

const Addbill = () => {
    var day = new Date();
    const [shop, setShop] = useState("");
    const [amount, setAmount] = useState();
    const [error, setError] = useState(false);
    const [shoplist, setShoplist] = useState([]);
    const location = useLocation();
    const [today, setToday] = useState(day.getDate()+'/'+(day.getMonth()+1)+'/'+day.getFullYear());

    useEffect(() => {
        if(location.state) setShop(location.state.shopname);
        getshops();
    }, [])

    const navigate = useNavigate();

    const getshops = async () => {
        let result = await fetch("http://localhost:5000/shops", {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setShoplist(result);
    };

    const addbill = async () => {
        if (!shop || !today || !amount) {
            setError(true);
            return false;
        }
        const selectobj = shoplist.find((item)=> item.name===shop)
        // console.warn(selectobj._id,today,amount)
        let result = await fetch(`http://localhost:5000/shop/${selectobj._id}`,{
            method:'put',
            body:JSON.stringify({pendingamt:Number(selectobj.pendingamt)+Number(amount)}),
            headers:{
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        // console.warn(result);
        result = await fetch("http://localhost:5000/addbill", {
            method: "post",
            body: JSON.stringify({ shopid: selectobj._id, date:today, amount, clear : false, amountleft:amount }),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
        });
        result = await result.json();
        // console.warn(result)
        if (result.shopid) {
            navigate("/bills");
        }
    };
    return (
        <div className='Add-shop'>
            <h1 className='h1'>Add Bill</h1>
            <div className="autocomplete-wrapper">
                <Autocomplete
                    value={shop}
                    items={shoplist}
                    getItemValue={item => item.name}
                    shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderMenu={item => (
                        <div className="dropdown" >
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item._id}>
                            {item.name}
                        </div>
                    }
                    onChange={(e) => setShop(e.target.value)}
                    onSelect={val => setShop(val)}
                    inputProps={{ placeholder: "Enter Shop name" }}
                />
            </div>
            {error && !shop && toast("Please enter valid name")}
            {/* <input className='inputstyle' type="text" placeholder='Enter name' value={shop} onChange={(e)=>{setShop(e.target.value)}} />*/}
            <input className='inputstyle' type="text" placeholder='Enter Bill date' value={today} onChange={(e) => { setToday(e.target.value) }} />
            {error && !today && toast('Please enter vaild date')}
            <input className='inputstyle' type="Number" placeholder='Enter Bill Amount (in Rs)' value={amount} onChange={(e) => { setAmount(e.target.value) }} />
            {error && !amount && toast('Please enter vaild amount')}
            <button className='button' onClick={addbill}>Add Bill</button>
        </div>
    )
};

export default Addbill;
