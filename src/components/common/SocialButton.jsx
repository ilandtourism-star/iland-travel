import React from 'react';

/**
 * Komponen SocialButton
 * Digunakan untuk log masuk sosial atau pautan media sosial.
 */
const SocialButton = ({ 
  icon = null, 
  provider = "Social", 
  link = "#" 
}) => {
  return (
    <a 
      href={link} 
      className={`btn-social btn-${provider.toLowerCase()}`}
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span className="social-icon">{icon}</span>
      <span className="social-text">Teruskan dengan {provider}</span>
    </a>
  );
};

export default SocialButton;
