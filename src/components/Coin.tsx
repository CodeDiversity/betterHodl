import React, { useState, useRef, useEffect } from 'react';
import type { Coin as CoinType } from '../types/CoinTypes';
import './Coin.css';

interface CoinProps {
  coin: CoinType;
}

export default function Coin({ coin }: CoinProps) {
  const [flash, setFlash] = useState(false);
  const prevValueRef = useRef<number | undefined | null>(coin.current_price);

  // Store the previous value
  useEffect(() => {
    prevValueRef.current = coin.current_price;
  }, [coin.current_price]);

  // Check if the value has changed
  useEffect(() => {
    if (prevValueRef.current !== coin.current_price) {
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
      <td className={`${flash ? 'flash-green' : ''}`}>
        {coin.current_price}
      </td>
      <td>{coin.market_cap}</td>
      <td>{coin.total_volume}</td>
      <td>{coin.symbol}</td>
    </tr>
  );
}
