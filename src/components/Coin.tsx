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
  const prevValueRef = useRef<string | undefined | null>(coin.priceUsd);
  // create a ref based upon a timestamp of when the coin is mounted;
  const lastUpdated = useRef(new Date());

  const formatCurrency = (value: string | number, wholeNumber?: boolean) => {
    // if whole number is true then return the value as a whole number
    if (wholeNumber) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    // if whole number is false and value is over a dollar return the value with 2 decimal places
    if (Number(value) > 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(Number(value));
    }
    // if whole number is false and value is less than a dollar return the value with 4 decimal places
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(Number(value));
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
    if (prevValueRef.current !== coin.priceUsd) {
      if (prevValueRef.current && prevValueRef.current < coin.priceUsd) {
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
      prevValueRef.current = coin.priceUsd;
      setMinutesAndSecondsSinceLastUpdate(0);

      // Clean up timer if component is unmounted
      return () => clearTimeout(timer);
    }
  }, [coin.priceUsd]);
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
        {formatCurrency(coin.priceUsd)}
      </td>
      <td>{formatCurrency(coin.marketCapUsd, true)}</td>
      <td>{formatCurrency(coin?.volumeUsd24Hr, true)}</td>
      <td>{formatMinutesAndSeconds(minutesAndSecondsSinceLastUpdate)}</td>
    </tr>
  );
}
