import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
function Footer() {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
         <div className="footer-content-left">
          <img  src={assets.logo} alt=''/>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique at temporibus ratione tempore saepe vero laudantium eaque voluptatem accusamus unde.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt=''/>
            <img src={assets.twitter_icon} alt=''/>
            <img src={assets.linkedin_icon} alt=''/>
          </div>
         </div>

         <div className="footer-contnet-center">
           <h2>COMPANY</h2>
           <ul>
             <li>Home</li>
             <li>About Us</li>
             <li>Delivery</li>
             <li>Privacy Policy</li>
           </ul>
         </div>

         <div className="footer-content-right">
          <h2>Get In Touch</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@Tomato.com</li>
          </ul>
         </div>
      </div>
      <hr/>
      <p className='footer-copyright'>Copyright 2024 © Tomato.com All rights reserved.</p>
    </div>
  )
}

export default Footer
