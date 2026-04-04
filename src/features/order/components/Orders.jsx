import React, { useState,useEffect } from 'react'
import { fetchOrders,selectOrderData,selectOrderTotalPages,selectOrderLoading,selectOrderError } from '../orderSlice'
import { useDispatch,useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Container, ListGroup,Row,Col } from 'react-bootstrap';
import Paginationbootstrap from '../../../components/Pagination';
import { useDebounce } from "use-debounce";
import {formatters} from '../../../utils/formatters'
const Orders = () => {
    
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const orders = useSelector(selectOrderData);
    const totalPages = useSelector(selectOrderTotalPages);
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);
     const currentSearch = searchParams.get("q") || "";
const [localSearch, setLocalSearch] = useState(currentSearch ?? "");
      const [debouncedSearch] = useDebounce(localSearch, 500);
     const currentPage = Number(searchParams.get("pageNumber")) || 1;
  const pSize = Number(searchParams.get("pageSize")) ||8;
   
    useEffect(() => {
        dispatch(fetchOrders({q: currentSearch, pageNumber: currentPage, pageSize: pSize }));
    }, [dispatch,searchParams]);

      // Debounced search - update URL params
     useEffect(() => {
      const s = String(debouncedSearch);
      const existingSearch = searchParams.get("q") || "";
    
      if (s !== existingSearch) {
        
        const params = Object.fromEntries([...searchParams]);
        params.q = s;           // Use 'q' to match backend
        params.pageNumber = "1"; // Use 'pageNumber' to match backend
        setSearchParams(params);
      }
    }, [debouncedSearch, setSearchParams]); // Removed searchParams to avoid infinite loops
    
  if (loading) {
    return <div>Loading orders...</div>;
  }
  if(error!=null){
     return (
    <div>
      <p>Error: {error}</p>
    </div>
  )
  }
    const updateParams = (newParams) => {
    const params= {
      ...Object.fromEntries(searchParams),
      ...newParams,
      page: "1", // Reset to page 1 on filter change
    };
    setSearchParams(params);
  };
  console.log (`Orders data: ${JSON.stringify(orders)}`)
  return (
    <>
    <Container fluid="md" className="mt-4">
       
       
        {orders.length === 0 ? (
             <Row>
              
              <Col md={8} className="mx-auto">
              
            <p>You have no orders yet.</p>
            </Col>
            </Row>
            
        ) : (
            <Row>
                <Col md={8} className="mx-auto">
                <h2>My Orders</h2>
                <Col xs={12} sm={6} md={3}>
                      <input
                        className="form-control mb-3"
                        type="text"
                        placeholder="search by order ID"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                      />
                    </Col>
            <ListGroup>
                {orders.map((order) => (
                    <ListGroup.Item 
  key={order.id} 
  className="d-flex justify-content-between"
>
    <div className="d-flex justify-content-between w-100 mb-2">
  <div className='gap-2'> <strong >Order: </strong><strong>{order.id.substring(1,8)}</strong></div>  
  <div><strong>Total:  </strong><strong>{formatters.currency(order.totalAmount.toFixed(2))}</strong></div>
  <div><strong>Date:  </strong><strong>{new Date(order.orderDate).toLocaleDateString()}</strong></div>
    <div><strong>Status:  </strong><strong>{order.status}</strong></div>
</div>

</ListGroup.Item>

                ))}
            </ListGroup>

            </Col>
            </Row>
        )}
    </Container>
    {!loading && orders.length > 0 && (
        <Container fluid="md" className="mt-4 d-flex justify-content-center">
          <Row> 
            <Col md={8} className="mx-auto">
          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          </Col>    
          </Row>
        </Container>
      )}
      </>
  )
}

export default Orders
