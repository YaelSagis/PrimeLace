import React from "react";
import { Link } from "react-router-dom";

export function DressCard(props)
{
    const dress = props.dress;
    const func = props.func;

    if(!dress)
        return <div>אין נתונים</div>

    return(
        <div className="dressCard" onClick={()=> func(dress._id)}>
            <div className="image">
                <img src={dress.image} alt={dress.name}></img>
            </div>
            <div className="dressDetails">
                <h3>{dress.name}</h3>
                <p>{dress.price}₪</p>
            </div>

        </div>
    )
}