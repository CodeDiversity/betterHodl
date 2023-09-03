import { useCoin } from '../hooks/useCoin';
import Coin from '../components/Coin';
import './Layout.css';

export default function Layout() {
  const { coins, error } = useCoin();

  return (
    <div className='container'>
      <h1>BetterHodl</h1>
      {error && (
        <div className='container'>
          <h1>Error: {error?.message}</h1>
        </div>
      )}
      {!error && !coins?.length && <div>Loading...</div>}
      {!error && coins?.length && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {coins?.map((coin) => (
              <Coin key={coin.id} coin={coin} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
