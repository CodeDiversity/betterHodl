// Imports
import { render } from '@testing-library/react';

// To Test
import Layout from '../App';
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
test('Renders layout', async () => {
  await act(async () => render(<Layout />));

  expect(true).toBeTruthy();
});

test('bitcoin should be in the document', async () => {
  await act(async () => render(<Layout />));

  expect(document.body.textContent).toContain('Bitcoin');
});

test('price are formatted correctly', async () => {
  await act(async () => render(<Layout />));
  expect(document.body.textContent).toContain('$50,000');
});