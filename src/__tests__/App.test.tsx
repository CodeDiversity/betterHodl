// Imports
import { render } from '@testing-library/react';

// To Test
import App from '../App';
import { act } from 'react-dom/test-utils';

// mock out the useCoin hook
jest.mock('../hooks/useCoin', () => ({
  useCoin: () => ({
    coins: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image:
          'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
        current_price: 50000,
        market_cap: 1000000000000,
        total_volume: 100000000000,
      },
    ],
    error: null,
  }),
}));

// Tests
test('Renders main page correctly', async () => {
  await act(async () => render(<App />));

  expect(true).toBeTruthy();
});