
import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
BarChart,
Bar,
AreaChart,
Area,
ReferenceLine,
} from "recharts";
import { Container,Col,Row } from "react-bootstrap";
import React, { useEffect, useMemo } from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchAllOrders,selectOrderData,selectOrderLoading,selectOrderError } from "../order/orderSlice";
const OrdersCharts = () => {
    const dispatch = useDispatch();
 const  orders = useSelector(selectOrderData);
 const loading = useSelector(selectOrderLoading);
 const error = useSelector(selectOrderError);
  console.log('orders in charts:', orders);

    useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
   const monthlyData = useMemo(() => {
     const map = {};
     orders.forEach((order) => {
       const month = new Date(order.orderDate).toLocaleString("default", { month: "short" });
        const monData=order.items.reduce((sum, i) => sum+i.quantity*i.unitPrice,0);
       
       map[month] = (map[month] || 0) + monData;
     });
 
     return Object.entries(map).map(([month, total]) => ({ month, total }));
   }, [orders]);
     console.log(monthlyData)
   if (loading) return <p>Loading charts...</p>;
   if (error) return <p style={{ color: "red" }}>{error}</p>;
 
  return (
      <>
    
    <Container style={{marginTop:50}}>
      <Row>
          <h2 className="text-xl font-semibold mb-4">📊 Order Analytics</h2>
        <Col md={6}>
  
    

      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h3 className="font-medium mb-2">Monthly Order Totals (Line)</h3>
        <ResponsiveContainer>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
  
     </Col>
      <Col md={6}>
      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h3 className="font-medium mb-2">Monthly Order Totals (Bar)</h3>
        <ResponsiveContainer>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    
    
    </Col>  
    </Row>
    </Container>
    </>

  )
};

export default OrdersCharts;
