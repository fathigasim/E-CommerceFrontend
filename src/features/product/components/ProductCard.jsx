import React from 'react';
import { Card ,Button} from 'react-bootstrap';
import { ProductImage } from './ProductImage';
import { BsCartPlus } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import  {addToBasket}  from '../../basket/basketSlice';
import {formatters} from '../../../utils/formatters'
export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = async ({productId,quantity})=>{
    try{
   await dispatch(addToBasket({productId,quantity})).unwrap();
    console.log('Product added to basket successfully');
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <Card 
      className="h-100 shadow-sm "
      style={{ 
        transition: "all 0.3s ease",
        cursor: "pointer"
      }}

    >
      <ProductImage
        imageUrl={product?.imageUrl}
        alt={product?.name}
        height="150px"
        className="card-img-top"
      />
      
      <Card.Body className="d-flex flex-column" style={{height:"140px"}} >
        <Card.Title className="text-truncate">{product?.name}</Card.Title>
        <Card.Text className="text-muted">
          {product?.description?.substring(0, 70)}...
        </Card.Text>
        <div className="mt-auto">
          <h5 className="text-primary">{formatters.currency(product?.price.toFixed(2))}</h5>
        </div>
      </Card.Body>
         <Button variant="primary"  className="mt-2 amiri-bold" 
         onClick={()=>handleAddToCart({productId:product.id,quantity:1})
    
         }
          ><span> addToCart <BsCartPlus size="1.5em" /></span></Button>
    </Card>
  );
};

export default ProductCard;