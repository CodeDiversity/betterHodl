import React from 'react';
import type { Coin as CoinType } from '../types/CoinTypes';
import './Coin.css';

interface CoinProps {
  coin: CoinType;
}

export default function Coin({ coin }: CoinProps) {
  return (
   
      <tr>
        <td>{coin.name}</td>
        <td>{coin.current_price}</td>
        <td>{coin.market_cap}</td>
        <td>{coin.total_volume}</td>
        <td>{coin.symbol}</td>
      </tr>
    
  );
}
