import { useState, useRef, useEffect } from 'react';
import type { Coin as CoinType } from '../types/CoinTypes';
import './Coin.css';

interface CoinProps {
  coin: CoinType;
}

export default function Coin({ coin }: CoinProps) {
  const [flash, setFlash] = useState(false);
  const [flashColor, setFlashColor] = useState('');
  const prevValueRef = useRef<number | undefined | null>(coin.current_price);

  const formatCurrency = (value: number, wholeNumber?: boolean) => {
    if (wholeNumber) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
      });
    }
  };

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
      <td>{coin.symbol}</td>
      <td className={`${flash ? flashColor : ''}`}>
        {formatCurrency(coin.current_price)}
      </td>
      <td>{formatCurrency(coin.market_cap, true)}</td>
      <td>{coin?.total_volume?.toLocaleString()}</td>
    </tr>
  );
}
