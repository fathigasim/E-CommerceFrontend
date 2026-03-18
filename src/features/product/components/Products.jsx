// components/Products.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { 
  fetchAllProducts, 
  selectProductData, 
  // selectProductTotalCount,
  selectProductPageSize,
  //selectProductTotalPages,
  selectProductError, 
  selectProductLoading 
} from '../productSlice';
import ProductCard from './ProductCard';
import { Alert, Spinner, Row, Col, Container } from "react-bootstrap";
import Paginationbootstrap from '../../../components/Pagination';
const Products = () => {
  const dispatch = useDispatch();
  //const totalCount = useSelector(selectProductTotalCount);
  const pageSize = useSelector(selectProductPageSize);
  //const totalPages = useSelector(selectProductTotalPages);
  const products = useSelector(selectProductData);
  const loading = useSelector(selectProductLoading); //  Fixed!
  const error = useSelector(selectProductError); //  Added!
  const [searchParams,setSearchParams] = useSearchParams();
  
  const currentPage = Number(searchParams.get("pageNumber")) || 1;
  const pSize = Number(searchParams.get("pageSize")) || 2;

  useEffect(() => {
    dispatch(fetchAllProducts({  pageNumber: currentPage,pageSize: pSize }));
  }, [dispatch, currentPage, pSize]); //  Added currentPage and pSize dependencies

  if (loading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }
  
   
//var totalPages = Math.ceil(products.totalCount / products.pageSize);
// const totalCount = products?.totalCount || 0;

// const totalPages = Math.ceil(totalCount / pSize) || 1;
  if (error) {
    return (
      
      <Container className="p-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container className="p-5">
        <Alert variant="info" className="text-center">
          No products found
        </Alert>
      </Container>
    );
  }

  return (
    <>
    <Container fluid className="py-4"> {/* ✅ Changed fluid="md" to fluid */}
      <Row className="g-4"> {/* ✅ Row with gap */}
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>

   
  
      {!loading && products.length > 0 && (
        <Container fluid="md" className="mt-4 d-flex justify-content-center">
          <Paginationbootstrap
            page={currentPage}
            totalPages={pageSize}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Container>
      )}
      </>
  );
};

export default Products;