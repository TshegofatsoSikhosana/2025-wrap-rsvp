import React from 'react';

const WrappedSlide = ({ title, content, bgColor = 'bg-wrapped-bg', textColor = 'text-white', children, isStatic = false, gif }) => {

  return (
    <div className={`slide-container ${bgColor} ${textColor}`}>
      <div className={!isStatic ? "animate-float h-120" : ""}>
        <h1 className="slide-title">{title}</h1>
        {content && <div className="slide-content" dangerouslySetInnerHTML={{ __html: content }} />}
        {gif && (
          <div className="slide-gif-container my-4 flex justify-center">
             <img src={gif} alt="Slide visual" className="max-h-48 rounded-lg object-contain" />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default WrappedSlide;
