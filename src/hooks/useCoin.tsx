import { useState, useEffect } from 'react';
import { Coin } from '../types/CoinTypes';
import { Observable } from 'rxjs';

type CoinPrice = {
  [key: string]: string;
};

export const useCoin = () => {
  const [coins, setCoins] = useState<Coin[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchCoins = async () => {
    return await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&locale=en'
    );
  };

  const webSocketObservables = new Observable((observer) => {
    const ws = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${coins
        ?.map((coin) => coin.id)
        .join(',')}}`
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

  useEffect(() => {
    fetchCoins()
      .then((response) => {
        return response.json();
      })
      .then((data) => setCoins(data))
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    const subscription = webSocketObservables.subscribe((data) => {
      if (data && typeof data === 'string') {
        console.log(data);
        const livePrice: CoinPrice = JSON.parse(data);
        coins?.forEach((c) => {
          if (c.id === Object.keys(livePrice)[0]) {
            c.current_price = Number(Object.values(livePrice)[0]);
          }
          setCoins([...coins]);
        });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    coins,
    error
  };
};
