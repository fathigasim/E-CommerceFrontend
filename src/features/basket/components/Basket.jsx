import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import {fetchBasket,removeFromBasket,clearBasket
   ,selectBasketLoading,
    selectBasketError,selectBasketData,selectBasketTotalCount,selectBasketItemCount} from '../basketSlice'

import {selectUser} from '../../auth/authSlice'
import { tokenService } from '../../../services/tokenService';
import { toast } from 'react-toastify'
import { FaInfoCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { Alert, Button, Col, Row } from 'react-bootstrap'
import  {ProductImage} from '../../product/components/ProductImage'
import Contrainer from 'react-bootstrap/Container'
import {formatters} from '../../../utils/formatters'
import { useTranslation } from 'react-i18next';

const Basket = () => {
     const {t}=useTranslation(["basket"]);
     
      const loading = useSelector(selectBasketLoading)
     const  items  = useSelector(selectBasketData);
     const error=useSelector(selectBasketError);
      const user  = useSelector(selectUser);
       const total =  useSelector(selectBasketTotalCount);
       const itemsCount=useSelector(selectBasketItemCount);
      const accessToken=tokenService.getAccessToken();
   
       const isLoggedIn = Boolean(user && accessToken);
const baseUrl = import.meta.env.VITE_STATIC_IMAGES_URL;
      const dispatch = useDispatch();
  
     const RemoveItemFromBasket = async({productId,quantity})=>{
           try{
            await dispatch(removeFromBasket({productId,quantity})).unwrap();
  await dispatch(fetchBasket()).unwrap(); 
           }
        catch(err){
          console.log(err)
        }
     }
   useEffect(() => {
        const controller = new AbortController();

        dispatch(fetchBasket());

        return () => {
            controller.abort(); // cleanup on unmount
        };
    }, [dispatch]);



    if(loading){
        return <div>{t("loading")}</div>
    }
    // if(error){
    //     return <div>{error}</div>
    // }
     if (!items || items.length === 0) {
        return null; // or a subtle "basket empty" message
    }
  return (
    <>
    
 
    {items.length !==0 && 
    <>
     
    <Contrainer   className='border rounded p-3 mt-3'
                        style={{
                            boxShadow: "5px 5px 10px rgba(0,0,0,0.5)",
                            opacity: loading ? 0.6 : 1,        // ✅ Subtle loading indicator
                            pointerEvents: loading ? 'none' : 'auto' // ✅ Disable interactions while loading
                        }}>
      <Row>
        <Col md={8} sm={12} style={{margin:'auto'}}> 
    {/* style={{display:'flex',flexDirection:'column', maxWidth:"400px",margin:"auto",boxShadow:"5px 5px 10px rgba(0,0,0,0.5)",borderRadius:'1rem',padding:'3px'}}  */}
    
       {isLoggedIn ? null : <Alert variant="danger"><span><FaInfoCircle /> {t("login_first")}</span></Alert>}
      {items&&
      
      <table className='table table-borderless text-center' style={{justifyContent:'center'}}>
        <thead><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th></th></thead>
        <tbody>
      {items.map((basket)=>{
      console.log('Basket item:', basket);
      return(
         <tr key={basket.productId}>
        <td ><img src={`${baseUrl}/${basket.imagePath}`} alt="Product" style={{width:'50px',height:'50px'}} className='img img-thumbnail' alt='default.png'/> </td><td>{basket.productName}</td><td>{basket.price}</td>
    
        <td>{basket.quantity}</td><td>
            <button style={{boxShadow:"5px 5px 10px rgba(0,0,0,0.5)"}} className='btn btn-danger' onClick={()=>{
              RemoveItemFromBasket({productId:basket.productId,quantity:1})}
              }><span><MdDeleteForever /> {t("remove")}</span></button></td>
      </tr>
      )
})
      }
         </tbody>
      </table>
      
    }
     <div className='alert alert-danger' style={{display:'flex',justifyContent:'center',height:'2rem',justifyItems:'center',padding:'2px'}}><p>Total:{formatters.currency(total)}</p>
                      </div>
                       <div className='' style={{display:'flex',justifyContent:'space-around',minHeight:'2rem',gap:'8rem',padding:'1px'}}>
        <div style={{zIndex:'100',justifyItems:'stretch'}}>  <button className='btn btn-danger rounded-pill' onClick={async ()=>{
          const confirmation=window.confirm('Are you sure you want to delete');
          if(confirmation){
            try{
         await dispatch(clearBasket()).unwrap();
         toast.success("Basket Cleared")
            }
            catch(err){
               toast.error(err || "Failed to clear basket");
            }
          }
        }}
          ><span><MdDeleteForever /> {t("remove_basket")}</span></button></div>
           <div style={{justifyItems:'end'}} >
            {/* <button 
            style={{boxShadow:"5px 5px 10px rgba(0,0,0,0.5)"}}
             disabled={!isLoggedIn}
             className='btn btn-primary rounded-pill' onClick={()=>handleCheckout()}><span><FaRegMoneyBillAlt className='mr-2'/> {t("Pay")}</span></button>
              */}
                <Button variant="primary" disabled={!isLoggedIn} className="rounded-pill" onClick={
                  
                  ()=>window.location.href='/checkout'
                  }><span><FaRegMoneyBillAlt className='mr-2'/> {t("pay")}</span></Button>
           </div>
         
    </div>
    </Col>
    </Row>
    </Contrainer>

   </>
}
    </>

  )
}

export default Basket
