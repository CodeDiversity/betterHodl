import { useState, useRef, useEffect } from 'react';
import type { Coin as CoinType } from '../types/CoinTypes';
import './Coin.css';

interface CoinProps {
  coin: CoinType;
}

export default function Coin({ coin }: CoinProps) {
  const [flash, setFlash] = useState(false);
  const [flashColor, setFlashColor] = useState('');
  const [
    minutesAndSecondsSinceLastUpdate,
    setMinutesAndSecondsSinceLastUpdate,
  ] = useState(0);
  const prevValueRef = useRef<number | undefined | null>(coin.current_price);
  // create a ref based upon a timestamp of when the coin is mounted;
  const lastUpdated = useRef(new Date());

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

  const formatMinutesAndSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // if minutes is zero then return only the seconds
    if (minutes === 0) {
      return `${remainingSeconds} seconds ago`;
    }
    // if minutes is greater than zero then return minutes and seconds
    if (minutes > 5) {
      return `${minutes} min ago`;
    }
    return `${minutes} min ${remainingSeconds} seconds ago`;
  };

  useEffect(() => {
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
      setMinutesAndSecondsSinceLastUpdate(
        Math.floor(
          (new Date().getTime() - lastUpdated.current.getTime()) / 1000
        )
      );
      lastUpdated.current = new Date();
      prevValueRef.current = coin.current_price;
      setMinutesAndSecondsSinceLastUpdate(0);

      // Clean up timer if component is unmounted
      return () => clearTimeout(timer);
    }
  }, [coin.current_price]);
  // create useEffect to update the minutesAndSecondsSinceLastUpdate state every 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinutesAndSecondsSinceLastUpdate(
        Math.floor(
          (new Date().getTime() - lastUpdated.current.getTime()) / 1000
        )
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [minutesAndSecondsSinceLastUpdate]);

  return (
    <tr>
      <td>{coin.name}</td>
      <td>{coin.symbol}</td>
      <td className={`${flash ? flashColor : ''}`}>
        {formatCurrency(coin.current_price)}
      </td>
      <td>{formatCurrency(coin.market_cap, true)}</td>
      <td>{coin?.total_volume?.toLocaleString()}</td>
      <td>{formatMinutesAndSeconds(minutesAndSecondsSinceLastUpdate)}</td>
    </tr>
  );
}
