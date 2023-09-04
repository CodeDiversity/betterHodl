import { render } from '@testing-library/react';
import Coin from '../components/Coin';
import { mockCoin } from '../mocks/CoinMock';

describe('Coin', () => {
  it('should render a price increase indicator if the price has increased', () => {
    const { getByText } = render(
      <Coin coin={{ ...mockCoin, current_price: 55000 }} />
    );
    expect(getByText('Bitcoin')).toBeInTheDocument();
    expect(getByText('BTC')).toBeInTheDocument();
    expect(getByText('$55,000.00')).toBeInTheDocument();
    expect(getByText('0 seconds ago')).toBeInTheDocument();
  });

  it('should render a price decrease indicator if the price has decreased', () => {
    const { getByText } = render(
      <Coin coin={{ ...mockCoin, current_price: 45000 }} />
    );

    expect(getByText('Bitcoin')).toBeInTheDocument();
    expect(getByText('BTC')).toBeInTheDocument();
    expect(getByText('$45,000.00')).toBeInTheDocument();
    expect(getByText('0 seconds ago')).toBeInTheDocument();
  });
});
