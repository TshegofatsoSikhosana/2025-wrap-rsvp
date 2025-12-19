import React from 'react';

const WrappedSlide = ({ title, content, bgColor = 'bg-wrapped-bg', textColor = 'text-white', children, isStatic = false }) => {
  return (
    <div className={`slide-container ${bgColor} ${textColor}`}>
      <div className={!isStatic ? "animate-float" : ""}>
        <h1 className="slide-title">{title}</h1>
        {content && <p className="slide-content">{content}</p>}
        {children}
      </div>
    </div>
  );
};

export default WrappedSlide;
