import Nav from'./components/Navbar/nav';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Footer from './components/footer/footer'
import SignUp from './components/signup/signup'
import Privatecomponent from './components/privatecomponent/privatecomponent';
import Login from './components/login/login';
import Addshop from './components/shops/addshop';
import Shops from './components/shops/shops';
import Updateshop from './components/shops/updateshops';
import Bills from './components/bills/bills';
import Addbill from './components/bills/addbill';
import Profile from './components/profile/profile';
import Payment from './components/payment/payment';
import Ledger from './components/ledger/ledger';
import Details from './components/details/detail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      {/* adding navbar  */}
      <Nav /> 
      <Routes>
        <Route element ={<Privatecomponent/>}>
        <Route path = "/"element={<h1>This is our home</h1>}/>
        <Route path = "/shops"element={<Shops />} />
        <Route path = '/shops/addshop' element = {<Addshop/>}/>
        <Route path = "/details"element={<Details/> }/>
        <Route path = "/logout"element={<h1>This is our logout page</h1>} />
        <Route path = "/updateshop/:id"element={<Updateshop/>} />
        <Route path = "/bills/"element={<Bills/>} />
        <Route path = "/bills/addbill/"element={<Addbill/>} />
        <Route path = "/profile/:id"element={<Profile/>} />
        <Route path = "/payment"element={<Payment/>} />
        <Route path = "/ledger/:id"element={<Ledger/>} />
        </Route>
        <Route path = "/signup"element={<SignUp/>} />
        <Route path = '/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
