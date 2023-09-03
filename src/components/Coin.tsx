import React, { useState, useRef, useEffect } from 'react';
import type { Coin as CoinType } from '../types/CoinTypes';
import './Coin.css';

interface CoinProps {
  coin: CoinType;
}

export default function Coin({ coin }: CoinProps) {
  const [flash, setFlash] = useState(false);
  const [flashColor, setFlashColor] = useState('');
  const prevValueRef = useRef<number | undefined | null>(coin.current_price);

  useEffect(() => {
    console.log(prevValueRef.current, coin.current_price);
    if (prevValueRef.current !== coin.current_price) {
      if (prevValueRef.current && prevValueRef.current < coin.current_price) {
        setFlashColor('flash-green');
      } else {
        setFlashColor('flash-red');
      }
      setFlash(true);
      const timer = setTimeout(() => {
        setFlash(false);
      }, 500);

      // Clean up timer if component is unmounted
      return () => clearTimeout(timer);
    }
  }, [coin.current_price]);

  return (
    <tr>
      <td>{coin.name}</td>
      <td className={`${flash ? flashColor : ''}`}>{coin.current_price}</td>
      <td>{coin.market_cap}</td>
      <td>{coin.total_volume}</td>
      <td>{coin.symbol}</td>
    </tr>
  );
}
