import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { foregotPassword, clearMessages } from "../../userManagement/userManagementSlice";

import { Container,Form,Button, Alert,Col,Row } from "react-bootstrap";


export default function ForegotPassword() {

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(
    (state) => state.usermanagement
  );
  
  const [email, setEmail] = useState("");
  const [emailSuccess,setEmailSuccess]=useState("");
   const [formErrors, setFormErrors] = useState({});
  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
    const result=await dispatch(foregotPassword({ email })).unwrap();
    setEmailSuccess(result.message);
    console.log("Forgot password success:", result);
    toast.success(result);
    setEmail("");
    setFormErrors({});
    }
    catch(err){
      console.error("Failed to send forgot password request:", err);

      if(err?.Email){
      setFormErrors({email:  err?.Email })
    }
    else{
       setFormErrors({email:'An unexpected error occurred.'})
    }
    }
    
  };

  useEffect(() => {
    if (error) {
     toast.error(error);
    console.log("Error:", error);
     
      dispatch(clearMessages());
    }
    if (success) {
     // toast.success(success);
      dispatch(clearMessages());
    }
  }, [dispatch,error, success]);

  return (
   
    <Container className="mt-5">
      <Row>
        <Col md={6}>
    <Form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96 px-3 py-3">
      {formErrors.email &&  <Alert variant="danger">{formErrors.email}</Alert>}
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control  type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
           placeholder="Enter_email"
      />
      {emailSuccess && <p style={{ color: "green" }}>{emailSuccess}</p>}
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group> */}
       <Button variant="primary" type="submit"
        disabled={loading}
           className="bg-blue-600 text-black w-full py-2 rounded hover:bg-blue-700"
       >
        {loading ? `sending` : `send_reset_link`}
      </Button>
    </Form>
    </Col>
    </Row>
    </Container>
  );
}
