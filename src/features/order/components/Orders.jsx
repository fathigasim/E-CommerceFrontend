import React, { useEffect } from 'react'
import { fetchOrders,selectOrderData,selectOrderLoading,selectOrderError } from '../orderSlice'
import { useDispatch,useSelector } from 'react-redux';
const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrderData);
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

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
  console.log (`Orders data: ${JSON.stringify(orders)}`)
  return (
    <div>
        <h2>My Orders</h2>
        {orders.length === 0 ? (
            <p>You have no orders yet.</p>
        ) : (
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <strong>Order #{order.id}</strong> - {order.orderDate}
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default Orders
