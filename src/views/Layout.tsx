import React from 'react';
import { useCoin } from '../hooks/useCoin';
import Coin from '../components/Coin';

export default function Layout() {
  const { coins } = useCoin();
  console.log(coins);
  return (
    <div>
      <h1>Top 25 Coins</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Volume</th>
            <th>Symbol</th>
          </tr>
        </thead>
        {coins?.map((coin) => (
          <Coin key={coin.id} coin={coin} />
        ))}
      </table>
    </div>
  );
}
