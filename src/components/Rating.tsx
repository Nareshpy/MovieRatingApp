import { useState } from 'react'
import {Rating} from 'react-simple-star-rating'
export const Rate=()=>{
    const [rating,setRating]=useState(0);
    const handleRating=(rate:number)=>
    {
       setRating(rate);
    }
    return(
        <div className='rating-parent'>
         <Rating onClick={handleRating} />
        </div>
    )
}