import React from "react";
import {Tilt} from "react-tilt";
import "./Logo.css";
import brain from "./brain.png";

const Logo = ()=>{
    return(
       
          
                <Tilt className="pa3 Tilt br2 shadow-2 ma2" options= {{max:25}} style={{ height: 250, width: 250 }} >
                  <div>
                    <img  src={brain} />
                  </div>
                </Tilt>
            
          
    )
}

export default Logo;