'use client';
import React, { useEffect, useRef, useState } from 'react';

const OdoMeter = ({ value = '0' }) => {
  const odometerRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const loadOdometer = async () => {
      if (!hasMounted) return;

      if (!window.Odometer) {
        await import('../../public/assets/scripts/odometer/odometer.js');
      }

      const numericValue = parseInt(value.replace(/,/g, ''), 10);

      if (!hasInitialized) {
        new window.Odometer({
          el: odometerRef.current,
          value: numericValue,
          format: '(,ddd)',
          theme: 'car',
          duration: 2000,
        });
        setHasInitialized(true);
      } else {
        odometerRef.current.innerHTML = numericValue;
      }
    };

    loadOdometer();
  }, [hasMounted, value, hasInitialized]);

  if (!hasMounted) return null;

  return (
    <div
      ref={odometerRef}
      className="odometer odometer-theme-car"
      id="odometerCustom"
    >
      0
    </div>
  );
};

export default OdoMeter;
