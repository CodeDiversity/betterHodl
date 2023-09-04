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
        explorer: 'https://explorer.bitcoin.com/btc',  // Placeholder, replace with the actual URL
        changePercent24Hr: '0.00',  // Placeholder, replace with the actual data
        marketCapUsd: '50000',  // Placeholder, replace with the actual data
        maxSupply: null,  // Placeholder, replace with the actual data
        priceUsd: '50000',  // Placeholder, replace with the actual data
        rank: '1',  // Placeholder, replace with the actual data
        supply: '0',  // Placeholder, replace with the actual data
        volumeUsd24Hr: '0.00',  // Placeholder, replace with the actual data
        vwap24Hr: '0.00',  // Placeholder, replace with the actual data
      }
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