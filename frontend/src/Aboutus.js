import React from 'react'
import './Aboutus.css'

import img1 from './images/1.jpg'
import img2 from './images/2.jpg'
import img3 from './images/3.jpg'
function Aboutus(){
    return(
      <div className='d-flex vh-100 justify-content-center align-items-center '> 
        <div class="container">
        <h2 class='mainhead1'>Team Crystal AI</h2> 
      <div class="box-about">
        <div class="imgBox-about">
          <img
            src={img1}
            alt="img"
          />
        </div>
        <div class="content">
          <h2>
            Kowshal<br />
            <span>Admin</span>
          </h2>
        </div>
      </div>

      <div class="box-about">
        <div class="imgBox-about">
          <img
            src={img2}
            alt=""
          />
        </div>
        <div class="content">
          <h2>
            Abhishek<br />
            <span>Team Member</span>
          </h2>
        </div>
      </div>
      <div class="box-about">
        <div class="imgBox-about">
          <img
            src={img3}
            alt=""
          />
        </div>
        <div class="content">
          <h2>
            Vinay<br />
            <span>Team member</span>
          </h2>
        </div>
      </div>
    </div>
   </div>
        
        
    )
}
export default Aboutus 
