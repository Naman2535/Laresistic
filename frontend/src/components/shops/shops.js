import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./shops.css";
const Shops = () => {
  const [shoplist, setShoplist] = useState([]);
  useEffect(() => {
    getshops();
  }, []);

  const getshops = async () => {
    let result = await fetch("http://localhost:5000/shops",{
      headers:{
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    // if(result.status===401){
    //   navigate("/login",{
    //       state:{
    //           session:true
    //       }
    //   })}
    result = await result.json();
    

    setShoplist(result);
  };
//   console.warn("shops", shoplist);

  const deleteshop = async (id)=>{
      let result = await fetch("http://localhost:5000/delete/"+id,{
          method:'delete',
          headers:{
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
      })
      result = await result.json();
      if(result.result === "Delete done") getshops();
      else{
        console.warn("Some error while deleting");
        getshops();
      }
  }
  const updateshop = (id)=>{
    navigate('/updateshop/'+ id )
  }
  const navigate = useNavigate();
  const addshop = () => {
    navigate("/shops/addshop");
  };

  const searchHandle = async (event)=>{
    let key = event.target.value;
    if(key){
      let result = await fetch(`http://localhost:5000/search/${key}`,{
        headers:{
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      result = await result.json();
      // const result = shoplist.filter(obj => Object.values(obj).some(val => val.toString().toUpperCase().includes(key)));
      if(result){
        setShoplist(result);
      }
    }else{
      getshops();
    }
  }

  const profilesection = (id)=>{
    navigate('/profile/'+ id )
  }

  return (
      <>
    <div className="shopsclasscheck">
      <h1 className="h1">Shops</h1>
      <input type="text" className="searchbox" placeholder="Search a shop" onChange={searchHandle}/>
      <div className="scrolldiv">
      <table>
        <thead>
          <tr>
            <td className="serialcheck hideshops2">S.no</td>
            <td>Name</td>
            <td className="hideshops2">Address</td>
            <td className="hideshops">Mobile</td>
            <td className="serialcheck">Route</td>
            <td>Operations</td>
          </tr>
        </thead>
        <tbody>
          {shoplist.length>0? shoplist.map((item,index) =>
          <tr key={item._id}>
          <td className="serialcheck hideshops2">{index +1}</td>
          <td className="namecursor"onClick={()=>profilesection(item._id)}>{item.name}</td>
          <td className="hideshops2">{item.address}</td>
          <td className="hideshops">{item.mobile}</td>
          <td className="serialcheck">{item.route}</td>
          <td><button className="deletebutton" onClick={()=>deleteshop(item._id)}>Delete</button>
            <button className="deletebutton update" onClick={()=>updateshop(item._id)}>Update</button>
            </td>
          </tr>
          ):<tr>
          <td className="serialcheck hideshops2"></td>
          <td className="">-------------</td>
          <td className="hideshops2">-------------</td>
          <td className="hideshops">--------------</td>
          <td className="serialcheck">-------------</td>
          <td><button className="deletebutton">--------</button>
            <button className="deletebutton update">--------</button>
            </td>
          </tr>       
        }
        </tbody>
      </table>
      </div>
      {shoplist.length>0 ? null:<h1 id="nores">No result Found</h1>}
      <div className="add-shop-butt" onClick={addshop} >
        ADD SHOP
      </div>
      </div>
    </>
  );
};
export default Shops;
