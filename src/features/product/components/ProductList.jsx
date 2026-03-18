import React, { useEffect } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import {useSearchParams,Link } from "react-router-dom";
import { selectProductData ,fetchAllProducts,selectProductLoading,selectProductPageSize} from '../productSlice';
import ProductCard from './ProductCard';
import { Alert, Spinner, Row, Col, Container } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import Paginationbootstrap from '../../../components/Pagination';   

export const ProductList = () => {
      const [searchParams,setSearchParams] = useSearchParams();
    const loading = useSelector(selectProductLoading);
      const pageSize = useSelector(selectProductPageSize);
  const currentPage = Number(searchParams.get("pageNumber")) || 1;
  const pSize = Number(searchParams.get("pageSize")) || 2;
        const dispatch = useDispatch();
    const products = useSelector(selectProductData);
     
  useEffect(() => {
    dispatch(fetchAllProducts({  pageNumber: currentPage,pageSize: pSize }));
  }, [dispatch, currentPage, pSize]); //  Added currentPage and pSize dependencies


    return (
        <Container className="my-4">
            {products.length === 0 ? (
                <Alert variant="info">No products available.</Alert>
            ) : (
                <ListGroup>
                    <ListGroup.Item>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                            <td>{product.description}</td>
                                            <td>
                                                <Link className="btn btn-primary" to={`/EditProduct/${product.id}`}>
                                                    Edit
                                                </Link>
                                                <button className="btn btn-danger">Delete</button>
                                            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ListGroup.Item>
                </ListGroup>
                
            )}

            {!loading && products.length > 0 && (
      
          <Paginationbootstrap
            page={currentPage}
            totalPages={pageSize}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />)}
            </Container>

      
      )}


export default ProductList;