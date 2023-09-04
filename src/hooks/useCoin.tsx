import { useState, useEffect } from 'react';
import { Coin } from '../types/CoinTypes';
import { Observable } from 'rxjs';

type CoinPrice = {
  [key: string]: string;
};

export const useCoin = () => {
  const [coins, setCoins] = useState<Coin[] | null>(null);
  console.log(coins, 'coins');
  const [error, setError] = useState<Error | null>(null);
  const fetchCoins = async () => {
    return await fetch('https://api.coincap.io/v2/assets?limit=25');
  };

  useEffect(() => {
    fetchCoins()
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setCoins(data.data);
      })
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    const webSocketObservables = new Observable((observer) => {
      const ws = new WebSocket(
        `wss://ws.coincap.io/prices?assets=${coins
          ?.map((coin) => coin.id)
          .join(',')}`
      );

      ws.onmessage = (event) => {
        observer.next(event.data);
      };

      ws.onerror = (error) => {
        observer.error(error);
      };

      ws.onclose = () => {
        observer.complete();
      };

      return () => {
        ws.close();
      };
    });

    const subscription = webSocketObservables.subscribe((data) => {
      console.log(data);
      if (data && typeof data === 'string') {
        const livePrice: CoinPrice = JSON.parse(data);
        setCoins((prevCoins) => {
          if (!prevCoins) return null;
          return prevCoins.map((coin) => ({
            ...coin,
            priceUsd:
              coin.id === Object.keys(livePrice)[0]
                ? Object.values(livePrice)[0]
                : coin.priceUsd,
          }));
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [coins]);

  return {
    coins,
    error,
  };
};
