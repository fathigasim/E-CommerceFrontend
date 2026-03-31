// components/Products.jsx
import React, { useEffect, useState ,useMemo} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { 
  fetchAllProducts, 
  selectProductData, 
  // selectProductTotalCount,
  selectProductPageSize,
  selectProductTotalPages,
  selectProductError, 
  selectProductLoading 
} from '../productSlice';
import {selectCategoryData,getCategory} from '../../category/categorySlice'
import ProductCard from './ProductCard';
import { Alert, Spinner, Row, Col, Container,Form,Button } from "react-bootstrap";
import Paginationbootstrap from '../../../components/Pagination';
import Basket from '../../basket/components/Basket';
import { useTranslation } from 'react-i18next';
//import {selectBasketLoading,selectBasketError,selectBasketData} from '../../basket/basketSlice'
const Products = () => {
  const {t}=useTranslation("product");
   const [searchParams, setSearchParams] = useSearchParams();

   // URL params as source of truth
  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("categoryId") || "";

  const currentPage = Number(searchParams.get("pageNumber")) || 1;
  const pSize = Number(searchParams.get("pageSize")) ||8;

    const [localSearch, setLocalSearch] = useState(currentSearch ?? "");
      const [debouncedSearch] = useDebounce(localSearch, 500);
  const dispatch = useDispatch();
  //const totalCount = useSelector(selectProductTotalCount);
  const categoryDto=useSelector(selectCategoryData);
  const pageSize = useSelector(selectProductPageSize);

  const totalPages = useSelector(selectProductTotalPages);
  const products = useSelector(selectProductData);
  const loading = useSelector(selectProductLoading); //  Fixed!
  const error = useSelector(selectProductError); //  Added!


  



   // Initial load - sync URL params with Redux
  useEffect(() => {
   
   
    dispatch(fetchAllProducts({ 
        q: currentSearch,
      categoryId: currentCategory,
      pageSize:pSize,
      pageNumber: currentPage ,
    
    }));
  }, [dispatch, searchParams]);

  // Debounced search - update URL params
 useEffect(() => {
  const s = String(debouncedSearch);
  const existingSearch = searchParams.get("q") || "";

  if (s !== existingSearch) {
    const params = Object.fromEntries(searchParams);
    params.q = s;           // Use 'q' to match backend
    params.pageNumber = "1"; // Use 'pageNumber' to match backend
    setSearchParams(params);
  }
}, [debouncedSearch, setSearchParams]); // Removed searchParams to avoid infinite loops

  // Load categories with error handling
  
useEffect(() => {
  const fetchCategories = async () => {
    const timeoutId = setTimeout(() => {
      console.error("Loading categories is taking too long. Please check your connection.");
    }, 5000); // 5 seconds timeout

    try {
      await dispatch(getCategory()).unwrap();
      clearTimeout(timeoutId); // Cancel timeout if successful
    } catch (err) {
      clearTimeout(timeoutId); // Cancel timeout on error
      console.error("Failed to load categories:", err);
      console.error(err.message || "Failed to load categories");
    }
  };

  fetchCategories();
}, [dispatch]);

  if (loading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">{t("loading")}</p>
      </Container>
    );
  }
   

 
// Helper function to update URL params
  const updateParams = (newParams) => {
    const params= {
      ...Object.fromEntries(searchParams),
      ...newParams,
      page: "1", // Reset to page 1 on filter change
    };
    setSearchParams(params);
  };
if (loading) return <Spinner />;
if (error) return (
 <div>Some went wrong</div>
 );
  if (error) {
    return (
      <>
      <Container className="p-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
      </>
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
  
           <Container fluid className="py-4 px-4 mb-5" >
            <Row className='justify-content-center'>
              <Col md={8} >
      <Basket/>
      </Col>
      </Row>
      </Container>
    
    <Container fluid className="py-4 px-4 mb-5" >
          <div className="mt-4 mb-3">
  <Row className="g-3 align-items-center">
    {/* Label */}
    <Col xs={12} md="auto">
      <h5 className="mb-0 fw-semibold">{t("Filters")}</h5>
    </Col>

    {/* Search Input */}
    <Col xs={12} sm={6} md={3}>
      <input
        className="form-control"
        type="text"
        placeholder={t("search")}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </Col>

    {/* Category Filter */}
    <Col xs={12} sm={6} md={3}>
      <select 
        className="form-select"
        value={currentCategory}
        onChange={(e) => updateParams({ categoryId: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="">
          {t("AllCategories")}
        </option>
        {categoryDto?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </Col>

  
   
  </Row>
</div>

    </Container>
    
   
    
         
    <Container fluid > {/* Changed fluid="md" to fluid */}
      <Row className="g-4 ">   {/* Row with gap */}
        {products.map((product) => (
          <Col className='px-2 py-2' style={{margin:'auto'}} key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>

   
  
      {!loading && products.length > 0 && (
        <Container fluid="md" className="mt-4 d-flex justify-content-center">
          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Container>
      )}
      </>
  );
}


export default Products;