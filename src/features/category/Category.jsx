
import React,{useState} from 'react'
import { addCategory } from './categorySlice'
import { useDispatch } from 'react-redux'
const Category = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const dispatch = useDispatch();

    const handleAddCategory = (e) => {
        e.preventDefault();

        const newCategory = {
            name: categoryName,
            description: categoryDescription
        };
        dispatch(addCategory(newCategory));
    };

    return (
        <div>
            <h1>Category Page</h1>
            <form  onSubmit={()=>handleAddCategory()}>    
                       <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                     placeholder="Enter category name"
                />
                <input
                    type="text"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Enter category description"
                />
                <button type="button" onClick={handleAddCategory}>
                    Add Category
                </button>
            </form>
        </div>
    )
}

export default Category
