// import { useParams,useNavigate } from 'react-router-dom';
// import {useEffect,useState} from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductById,selectProductLoading,selectProductItem,updateProduct,clearError} from '../productSlice';
// import { Container, Spinner, Alert,Form,Button,FormGroup,Col,Row,FormControl} from 'react-bootstrap';
// import { getCategory, selectCategoryData } from '../../category/categorySlice';
// import { toast } from 'react-toastify';
// export const ProductEdit = () => {
//           const {Id}=useParams()
//           const navigate=useNavigate();
//           const dispatch = useDispatch();
     
//           const loading = useSelector(selectProductLoading);
//           const product = useSelector(selectProductItem);
//           const categories=useSelector(selectCategoryData)
//           const [id, setId] = useState("");
// const [name, setName] = useState("");
// const [description, setDescription] = useState("");
// const [price, setPrice] = useState("");
// const [stockQuantity, setStockQuantity] = useState("");
// const [categoryId, setCategoryId] = useState([]);
// const [image, setImage] = useState(null);
//    const [formErrors, setFormErrors] = useState({});
// useEffect(() => {
//     const fetchProductId = async () => {
//         try {
//             await dispatch(fetchProductById(Id)).unwrap();
//         } catch (error) {
//             console.log(`error fetching product by id: ${error}`);
//         }
//     };
//     fetchProductId();
// }, [dispatch, Id]);

//   useEffect(()=>{

//         const getCategories=async ()=>{
//           try{
//           await dispatch(getCategory().unwrap())
//           }
//           catch(err){
//                 console.log(err)
//           }
//         };
//      getCategories();
//   },[dispatch])

// useEffect(() => {
//     if (product) {
//         console.log('Product data in ProductEdit:', product);
//         setId(product.id||"");
//         setName(product.name || "");
//         setDescription(product.description || "");
//         setPrice(product.price || "");
//         setStockQuantity(product.stockQuantity || "");
//         setCategoryId(product.categoryId || "");
//         setImage(null); // Reset image to null when product changes
//     }
// // Only run this effect when product.id changes to avoid cascading renders
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [product && product.id]);


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   dispatch(clearError());

//   const submitData = new FormData();
//   submitData.append("Id",id)
//   submitData.append("Name", name);
//   submitData.append("Description", description);
//   submitData.append("Price", price);
//   submitData.append("StockQuantity", stockQuantity);
//   submitData.append("CategoryId", categoryId);
  
//   if (image) {
//     submitData.append("Image", image);
//   }

//   try {
//     await dispatch(updateProduct({ Id: id, formData: submitData })).unwrap();

  
   
//    toast.success("Product updated successfully!", {
//   onClose: () => navigate("/products"),
//   autoClose: 2000
// });
//   } catch (err) {
//     console.error("Failed to update product:", err);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     console.log("Validation errors:", err);
    
//         setFormErrors({
//           name: err?.Name?.[0],
//           price: err?.Price?.[0],
//           image: err?.Image?.[0],
//           stock: err?.StockQuantity?.[0],
//           description: err?.Description?.[0]
//         });
//       console.log("Form errors set to:",  formErrors.image);
//         toast.error("Failed to add product");
//   }
// };
//    const baseUrl = import.meta.env.VITE_STATIC_IMAGES_URL;
//     return(

//         <>
//         <Container className="my-4">
//             {loading ? (
//                 <div className="text-center p-5">
//                     <Spinner animation="border" />
//                     </div>
//                     ):(
//                         <Container>
//                            <Row>
//                             <Col md={6} className="mb-3">
//                           {product?.imageUrl && (
//   <img
//     src={`${baseUrl}/${product.imageUrl}`}
//     alt="Product"
//     style={{ width: "150px", marginBottom: "10px" }}
//   />
// )}
//                                <Form noValidate onSubmit={handleSubmit}>
      
//       <Form.Group md={6} className="mb-3" controlId="Id">
//         <Form.Control
//         hidden
//     type="text"
//     value={id}
//     onChange={(e)=>setId(e.target.value)}
//   />
     
       

     
//       </Form.Group >
//    <FormGroup className="mb-3" controlId="nameId">
//      <Form.Label>Product Name</Form.Label>
//         <Form.Control
       
//           placeholder="Name"
//           value={name}
//           onChange={(e) =>{ setName(e.target.value)

//                    if (formErrors.name) {
//       setFormErrors(prev => ({
//         ...prev,
//         name: undefined
//       }))}
//           }}
//           //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
//            isInvalid={!!formErrors.name}
//            disabled={loading}
//         />
//           <Form.Control.Feedback type="invalid">
//                             {formErrors.name}
//                           </Form.Control.Feedback>
//         </FormGroup>
//       <FormGroup>
//          <Form.Label>Description </Form.Label>
//         <Form.Control
       
//           placeholder="Description"
//           value={description}
//           onChange={(e) =>{ setDescription(e.target.value)

//                    if (formErrors.description) {
//       setFormErrors(prev => ({
//         ...prev,
//         description: undefined
//       }))}
//           }}
//           //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
//            isInvalid={!!formErrors.description}
//            disabled={loading}
//         />
//           <Form.Control.Feedback type="invalid">
//                             {formErrors.description}
//                           </Form.Control.Feedback>
//         </FormGroup>

       
//     <FormGroup>
//      <Form.Label>Price</Form.Label> 
//           <FormControl
          
//             placeholder= "Price"
//             min="1"
           
//             type="number"
//             value={price}
//             onChange={(e) =>{ setPrice(e.target.value)
//                      if (formErrors.price) {
//         setFormErrors(prev => ({
//           ...prev,
//           price: undefined
//         }))}
//             }}
//             // className={formErrors.price ? "form-control col-md-2 is-invalid" : "form-control"}
//          isInvalid={!!formErrors.price}
//          disabled={loading}
//          />
//           <Form.Control.Feedback type="invalid">
//                               {formErrors.price}
//                             </Form.Control.Feedback>
                               
//           </FormGroup>
  
      
//       <FormGroup  className="mb-3" controlId="stockQuantityId">
//          <Form.Label>Stock Quantity </Form.Label>
        
//        <FormControl
//                 style={{ padding: "0.5rem", borderRadius: "0.3rem", flex: "1 1 150px" }}
//                 placeholder="Stock Quantity"
//                 min="0"
//                 //step="0.01"
//                 type="number"
//                 value={stockQuantity}
//                 onChange={(e) =>{setStockQuantity(e.target.value)
      
//                     if (formErrors.stock) {
//             setFormErrors(prev => ({
//               ...prev,
//               stock: undefined
//             }))}
//                 }}
                
//                 // className={formErrors.stock ? "form-control col-md-2 is-invalid" : "form-control"}
//                  isInvalid={!!formErrors.stock}
//              disabled={loading}
//               />
//                 <Form.Control.Feedback type="invalid">
//                                   {formErrors.stock}
//                                 </Form.Control.Feedback>
//               </FormGroup>
//           <Form.Group>
//               <FormSelect 
//                      className="mb-2 form-control col-md-2"
//                      value={categoryId}
//                      onChange={(e) => setCategoryId(e.target.value )}
//                     // aria-label="Filter by category"
//                    >
//                      <option value="">
//                      "All Categories"
//                      </option>
//                      {categories?.map((cat) => (
//                        <option key={cat.id} value={cat.id}>
//                        {cat.name}
//                        </option>
                    
//                      ))}
//                         </FormSelect>
//                 </Form.Group>

          
//       <Form.Group className="mb-3" controlId="imageId">
//         <Form.Label>Image</Form.Label>
//         <Form.Control
//           type="file"
//           accept="image/*"
//           onChange={(e) =>{ setImage(e.target.files[0])
//          if (formErrors.image) {
//             setFormErrors(prev => ({
//               ...prev,
//               image : undefined
//             }))}
//           }}
//             isInvalid={!!formErrors.image}
//              disabled={loading}
//         />
//          <Form.Control.Feedback type="invalid">
//                                   {formErrors.image}
//                                 </Form.Control.Feedback>
//       </Form.Group>

//       <Button variant="primary" type="submit">
//         Update
//       </Button>
//     </Form>
//     </Col>
//     </Row>
//                         </Container>
                       
//                     )
//             }
   
//         </Container>
       



//         </>
//     );
// }

// export default ProductEdit;

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
    fetchProductById, 
    selectProductLoading, 
    selectProductItem, 
    updateProduct, 
    clearError 
} from '../productSlice';
import { getCategory, selectCategoryData } from '../../category/categorySlice';
import { 
    Container, Spinner, Form, Button, FormGroup, Col, Row, FormControl 
} from 'react-bootstrap';
import { toast } from 'react-toastify';

export const ProductEdit = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loading = useSelector(selectProductLoading);
    const product = useSelector(selectProductItem);
    const categories = useSelector(selectCategoryData);

    // 1. Initialize React Hook Form
    const { 
        register, 
        handleSubmit, 
        reset, 
        setValue, 
        formState: { errors: valErrors } 
    } = useForm();

    // 2. Fetch initial data
    useEffect(() => {
        dispatch(fetchProductById(Id));
        dispatch(getCategory());
    }, [dispatch, Id]);

    // 3. Sync Redux data to Form (Replaces all individual state setters)
    useEffect(() => {
        if (product) {
            reset({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stockQuantity: product.stockQuantity,
                categoryId: product.categoryId
            });
        }
    }, [product, reset]);

    const onFormSubmit = async (data) => {
        dispatch(clearError());

        // 4. Transform JSON data to FormData for the Backend
        const submitData = new FormData();
        submitData.append("Id", data.id);
        submitData.append("Name", data.name);
        submitData.append("Description", data.description);
        submitData.append("Price", data.price);
        submitData.append("StockQuantity", data.stockQuantity);
        submitData.append("CategoryId", data.categoryId);

        // Handle Image specifically
        if (data.image && data.image[0]) {
            submitData.append("Image", data.image[0]);
        }

        try {
            await dispatch(updateProduct({ Id: data.id, formData: submitData })).unwrap();
            
            toast.success("Product updated successfully!", {
                onClose: () => navigate("/products"),
                autoClose: 2000
            });
        } catch (err) {
            console.error("Validation errors from server:", err);
            toast.error("Failed to update product");
        }
    };

    const baseUrl = import.meta.env.VITE_STATIC_IMAGES_URL;

    return (
        <Container className="my-4">
            {loading ? (
                <div className="text-center p-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row>
                    <Col md={6} className="mb-3">
                        {product?.imageUrl && (
                            <img
                                src={`${baseUrl}/${product.imageUrl}`}
                                alt="Product"
                                className="img-thumbnail"
                                style={{ width: "150px", marginBottom: "10px" }}
                            />
                        )}
                        <Form noValidate onSubmit={handleSubmit(onFormSubmit)}>
                            {/* Hidden ID Field */}
                            <input type="hidden" {...register("id")} />

                            {/* Name Field */}
                            <FormGroup className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    {...register("name", { required: "Name is required" })}
                                    isInvalid={!!valErrors.name}
                                    placeholder="Enter product name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {valErrors.name?.message}
                                </Form.Control.Feedback>
                            </FormGroup>

                            {/* Description Field */}
                            <FormGroup className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    {...register("description", { required: "Description is required" })}
                                    isInvalid={!!valErrors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {valErrors.description?.message}
                                </Form.Control.Feedback>
                            </FormGroup>

                            {/* Price and Stock Row */}
                            <Row>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            {...register("price", { required: "Price is required", min: 1 })}
                                            isInvalid={!!valErrors.price}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Form.Label>Stock Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            {...register("stockQuantity", { required: "Stock is required", min: 0 })}
                                            isInvalid={!!valErrors.stockQuantity}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Category Dropdown */}
                            <FormGroup className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select 
                                    {...register("categoryId", { required: "Please select a category" })}
                                    isInvalid={!!valErrors.categoryId}
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </FormGroup>

                            {/* Image Upload */}
                            <FormGroup className="mb-3">
                                <Form.Label>Update Image (Optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    {...register("image")}
                                />
                            </FormGroup>

                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Product"}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ProductEdit;