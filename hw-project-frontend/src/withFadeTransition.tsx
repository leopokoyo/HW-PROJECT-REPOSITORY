import React, { useEffect, useState } from 'react';

const withFadeTransition = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const [fadeType, setFadeType] = useState('fade-in');

    useEffect(() => {
      setFadeType('fade-in');
    }, []);

    const handleFadeOut = () => {
      setFadeType('fade-out');
      setTimeout(() => {
        if (props.onTransitionEnd) {
          props.onTransitionEnd();
        }
      }, 1000); // Match the fade-out duration
    };

    return (
      <div className={fadeType}>
        <WrappedComponent {...props} onFadeOut={handleFadeOut} />
      </div>
    );
  };
};

export default withFadeTransition;
