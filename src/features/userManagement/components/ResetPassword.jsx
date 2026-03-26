import React, { useState } from "react";
import {  useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  resetPassword,
 // clearMessages,
  selectUsermanagementLoading,
//  selectUsermanagementError,
  // selectUsermanagementData,
  // selectUsermanagementSuccess,
} from "../../userManagement/userManagementSlice";
import { Col, Container, Row,Alert } from "react-bootstrap";

export default function ResetPassword() {
  const [resetError, setResetError] = useState({
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [searchParams] = useSearchParams();
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  const loading = useSelector(selectUsermanagementLoading);
  // const error = useSelector(selectUsermanagementError);
  // const data = useSelector(selectUsermanagementData);
  // const success = useSelector(selectUsermanagementSuccess);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResetError({ newPassword: "", newPasswordConfirm: "" });

    if (!token || !email) {
      toast.error("Invalid or missing token/email.");
      return;
    }

    // if (!newPassword || !newPasswordConfirm) {
    //   toast.error("Please fill in both password fields.");
    //   return;
    // }

    // if (newPassword !== newPasswordConfirm) {
    //   setResetError({
    //     newPassword: "",
    //     newPasswordConfirm: "Passwords do not match",
    //   });
    //   return;
    // }

    try {

      const decodedToken = decodeURIComponent(token);

      await dispatch(
        resetPassword({
          email,
          token: decodedToken,
          newPassword,
          newPasswordConfirm,
        })
      ).unwrap();

      // Success handled in useEffect
    } catch (error) {
      console.error("Failed to reset password:", error);
      setFormErrors({
    newPassword: error.NewPassword?.[0],
    newPasswordConfirm: error.NewPasswordConfirm?.[0],
    general: !error ? "An unexpected error occurred." : undefined
  });
    }
  };

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearMessages());
  //   }
  //   if (success) {
  //     toast.success(data || "Password reset successful!");
  //     dispatch(clearMessages());
  //     const addTimeout = setTimeout(() => navigate("/login"), 2000);
  //     return () => clearTimeout(addTimeout);
  //   }
  // }, [dispatch, navigate, error, success, data]);

  return (
    <Container className="mt-5">

      <Row className="justify-content-center">
        <Col md={8} className="p-2">
      
      <form
      style={{ padding: "10px" }}
  className="bg-white shadow rounded w-100"
        noValidate
        onSubmit={handleSubmit}
       
      >
        
          <h2 className="text-xl text-center font-semibold mb-4">Reset Password</h2>

          {formErrors.newPassword && (
            <p style={{ color: "red" }}>{formErrors.newPassword}</p>
          )}
          <Row className="align-items-center mb-3">
           <Col md={3}>
            <label className="block mb-2 text-sm font-medium ">New Password</label>
        </Col>
        <Col md={9}>    
                <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control border rounded  p-2 mb-4"
              required
              minLength={6}
              
            />
      </Col>

          </Row>

          {formErrors.newPasswordConfirm && (
            <p style={{ color: "red" }}>{formErrors.newPasswordConfirm}</p>
          )}
            <Row className="align-items-center mb-3">
           
            <Col md={3}>
            <label className="block mb-2 text-sm font-medium ">Confirm New Password</label>
        </Col>
        <Col md={9}> 
           
           
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="form-control border rounded w-full p-2 mb-4"
              required
              minLength={6}
              
            />
             </Col>
            </Row>
          
         
          <Row className="mt-3 justify-content-end" >
            <Col md={9}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            </Col>
          </Row>
        
      </form>
      </Col>
      </Row>
    </Container>
  );
}