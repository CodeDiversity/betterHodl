import { renderHook } from '@testing-library/react-hooks';
import { useCoin } from '../hooks/useCoin';

describe('useCoin', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('api.coingecko.com')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
              { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
            ]),
        });
      } else if (url.includes('api.coincap.io')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
                { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
              ],
            }),
        });
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch coins and coin ids on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCoin());

    expect(result.current.coins).toEqual([]);
    expect(result.current.error).toEqual(null);

    await waitForNextUpdate();

    expect(result.current.coins).toEqual([
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    ]);
    expect(result.current.error).toEqual(null);
  });

  it('should handle errors', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result, waitForNextUpdate } = renderHook(() => useCoin());

    expect(result.current.coins).toEqual([]);
    expect(result.current.error).toEqual(null);

    await waitForNextUpdate();

    expect(result.current.coins).toEqual([]);
    expect(result.current.error).toEqual(new Error('Network error'));
  });
});
