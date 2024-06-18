import React from 'react';
import './css/HelloWorld.css';

const HelloWorld: React.FC = () => {
  const text = "BigMacIndex";
  return (
    <div className="hello-world">
      {text.split('').map((letter, index) => (
        <span key={index} className="letter" style={{ animationDelay: `${index * 0.1}s` }}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default HelloWorld;