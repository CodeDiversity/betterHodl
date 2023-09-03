import React from 'react';
import { useCoin } from '../hooks/useCoin';
import Coin from '../components/Coin';

export default function Layout() {
  const { coins, error } = useCoin();
  console.log(error)

  if (error) return <div>Error: {error.message}</div>;
  if (!coins?.length) return <div>Loading...</div>;
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
        <tbody>≈
        {coins?.map((coin) => (
          <Coin key={coin.id} coin={coin} />
        ))}
        </tbody>
      </table>
    </div>
  );
}
