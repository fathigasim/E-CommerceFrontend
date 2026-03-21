import React,{useEffect} from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {getPayments,selectPaymentData,selectPaymentLoading,selectPaymentPageSize,selectPaymentTotalPages} from '../paymentsSlice'
import { ListGroup, ListGroupItem,Container,Row ,Col, Card,CardHeader, CardBody } from 'react-bootstrap';
import Paginationbootstrap  from '../../../components/Pagination';
import  PaginationbootstrapElipsed from '../../../components/ElipsedPagination'
import {useRoles} from '../../../features/auth/hooks/useRoles.js'
const Payments = () => {
   const { isAdmin, hasRole } = useRoles();
  const dispatch = useDispatch();
  const payments = useSelector(selectPaymentData);
  const totalPages = useSelector(selectPaymentTotalPages);
  const loading = useSelector(selectPaymentLoading);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage =
    Number(searchParams.get("pageNumber")) || 1;

  const pSize =
    Number(searchParams.get("pageSize")) || 6;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        await dispatch(
          getPayments({ pageNumber: currentPage, pageSize: pSize })
        ).unwrap();
      } catch (err) {
        console.log(err);
      }
    };

    fetchPayments();
  }, [dispatch, currentPage, pSize]);

  if (loading) return <div>....loading</div>;
 {console.log('Payments',payments)}
  return (
   
    <>
    <Container fluid className="py-4">
      <Row className="g-4">
        {payments?.map((payment) => (
          <Col key={payment.id} xs={12} sm={6} md={4} lg={3}>
            <ListGroup>
              <ListGroupItem>
                <Card>
                    <CardHeader>
                        <h3>Payment Details</h3>
                    <span>{payment.status} </span>
                    <span>{payment.createdAt} </span>
                    <span>{payment.orderId} </span>
                  </CardHeader>
                  <CardBody>
                       
                 <table  className='table table-responsive'>
                    {payment.order?.items?.map((item)=>(
                       <tr key={item.id}>
                           <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                     <td>{item.price}</td>
                     <td>{item.unitPrice}</td>
                     <td></td>
                       </tr>

                    ))}
                  </table>
                  {isAdmin&&
                  <Link to={`/refund/${payment.id}`}>Refund</Link>
                     }
                  </CardBody>
                 </Card>
              </ListGroupItem>
            </ListGroup>
          </Col>
        ))}
      </Row>
    </Container>
    
      {!loading && payments.length > 0 && (
        <Container fluid="md" className="mt-4 d-flex justify-content-center">
          <PaginationbootstrapElipsed
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Container>
      )}
      </>
  );
};

export default Payments
