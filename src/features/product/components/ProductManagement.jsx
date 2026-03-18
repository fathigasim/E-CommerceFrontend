import React,{useState,useRef, useEffect} from 'react'
import { useDispatch,useSelector} from 'react-redux'
import { addProducts,selectProductLoading } from '../productSlice'
import { selectCategoryData,getCategory } from '../../category/categorySlice'
import { toast } from 'react-toastify'
import { Form, Button, Row, Col } from 'react-bootstrap'

import { FormGroup, FormControl, FormLabel, FormSelect,  Container } from 'react-bootstrap';

const ProductManagement = () => {
     const [name, setName] = useState("");
  const [price, setPrice ] = useState("1");
  const [stockQuantity, setStockQuantity] = useState("0");    
  const [category,setCategory] = useState("");
    const [description, setDescription] = useState("");
      const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
   const [formErrors, setFormErrors] = useState({});
   const loading = useSelector(selectProductLoading);
  const categories = useSelector(selectCategoryData);
  const dispatch = useDispatch();
 
    useEffect(()=>{
    
            const getCategories=async ()=>{
              try{
                // if (status === 'idle') {
          var result=    await dispatch(getCategory()).unwrap()
            console.log(`CategoryData in product component`,result)
        //  }
              }
              catch(err){
                    console.log(err)
              }
            };
         getCategories();
      },[dispatch])

const handleAdd = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stockQuantity", stockQuantity);
    formData.append("categoryId", category);

    if (image) {
      formData.append("image", image);
    }

    const result = await dispatch(addProducts(formData)).unwrap();

    toast.success("Product added successfully");

    setName("");
    setPrice("");
    setStockQuantity("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (err) {

    console.log("Validation errors:", err);

    setFormErrors({
      name: err?.Name?.[0],
      price: err?.Price?.[0],
      image: err?.Image?.[0],
      stock: err?.StockQuantity?.[0],
      description: err?.Description?.[0],
      category:err?.CategoryId?.[0]
    });

    toast.error("Failed to add product");
  }
};
  return (
    <>
        <Container className="my-4">
  <Row>
    <Col md={6} className="mb-3">
  <Form noValidate onSubmit={handleAdd}>
      
      
   <FormGroup className="mb-3" controlId="nameId">
     <Form.Label>Product Name</Form.Label>
        <Form.Control
       
          placeholder="Name"
          value={name}
          onChange={(e) =>{ setName(e.target.value)

                   if (formErrors.name) {
      setFormErrors(prev => ({
        ...prev,
        name: undefined
      }))}
          }}
          //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
           isInvalid={!!formErrors.name}
           disabled={loading}
        />
          <Form.Control.Feedback type="invalid">
          {formErrors.name}
           </Form.Control.Feedback>
        </FormGroup>
      <FormGroup className="mb-3" controlId="descriptionId">
         <Form.Label>Description </Form.Label>
        <Form.Control
       
          placeholder="Description"
          value={description}
          onChange={(e) =>{ setDescription(e.target.value)

                   if (formErrors.description) {
      setFormErrors(prev => ({
        ...prev,
        description: undefined
      }))}
          }}
          //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
           isInvalid={!!formErrors.description}
           disabled={loading}
        />
          <Form.Control.Feedback type="invalid">
      {formErrors.description}
      </Form.Control.Feedback>
        </FormGroup>

       
    <FormGroup>
     <Form.Label>Price</Form.Label> 
          <FormControl
          
            placeholder= "Price"
            min="1"
           
            type="number"
            value={price}
            onChange={(e) =>{ setPrice(e.target.value)
                     if (formErrors.price) {
        setFormErrors(prev => ({
          ...prev,
          price: undefined
        }))}
            }}
            // className={formErrors.price ? "form-control col-md-2 is-invalid" : "form-control"}
         isInvalid={!!formErrors.price}
         disabled={loading}
         />
          <Form.Control.Feedback type="invalid">
         {formErrors.price}
          </Form.Control.Feedback>
                               
          </FormGroup>
  
      
      <FormGroup  className="mb-3" controlId="stockQuantityId">
         <Form.Label>Stock Quantity </Form.Label>
        
       <FormControl
                style={{ padding: "0.5rem", borderRadius: "0.3rem", flex: "1 1 150px" }}
                placeholder="Stock Quantity"
                min="0"
                //step="0.01"
                type="number"
                value={stockQuantity}
                onChange={(e) =>{setStockQuantity(e.target.value)
      
                    if (formErrors.stock) {
            setFormErrors(prev => ({
              ...prev,
              stock: undefined
            }))}
                }}
                
                // className={formErrors.stock ? "form-control col-md-2 is-invalid" : "form-control"}
                 isInvalid={!!formErrors.stock}
             disabled={loading}
              />
                <Form.Control.Feedback type="invalid">
                                  {formErrors.stock}
                                </Form.Control.Feedback>
              </FormGroup>
 <Form.Group>
              <FormSelect 
                     className="mb-2 form-control col-md-2"
                     value={category}
                      isInvalid={!!formErrors.category} 
                     onChange={(e) =>{ setCategory(e.target.value )
                    
                     if (formErrors.category) {
        setFormErrors(prev => ({
          ...prev,
          category: undefined
        }))
                    }}}
                    // aria-label="Filter by category"
                   >
                     <option value="">
                     All Categories
                     </option>
                     {categories?.map((cat) => (
                       <option key={cat.id} value={cat.id}>
                         { cat.name }
                       </option>
                    
                     ))}
                        </FormSelect>
                          <Form.Control.Feedback type="invalid">
                                  {formErrors.category}
                                </Form.Control.Feedback>
                </Form.Group>

      <Form.Group className="mb-3" controlId="imageId">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) =>{ setImage(e.target.files[0])
         if (formErrors.image) {
            setFormErrors(prev => ({
              ...prev,
              image : undefined
            }))}
          }}
            isInvalid={!!formErrors.image}
             disabled={loading}
        />
         <Form.Control.Feedback type="invalid">
                                  {formErrors.image}
                                </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Product
       </Button>
    </Form>
    </Col>


   </Row>
   </Container>
        </>
  )}


export default ProductManagement;
