import { useState, useEffect } from 'react';
import {Coin} from '../types/CoinTypes';
import { Observable } from 'rxjs';

type CoinPrice = {
  [key: string]: string;
}

export const useCoin = () => {
  const [coins, setCoins] = useState<Coin[] | null>([]);
  const fetchCoins = async () => {
    return await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&locale=en'
    );
  };

  const webSocketObservables = new Observable((observer) => {
    const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${ coins?.map((coin) => coin.id).join(',')}}`)
    ws.onmessage = (event) => {
      observer.next(event.data)
    }
    ws.onerror = (error) => {
      observer.error(error)
    }
    ws.onclose = () => {
      observer.complete()
    }
    return () => {
      ws.close()
    }
  })
 

  useEffect(() => {
    fetchCoins()
      .then((response) => response.json())
      .then((data) => setCoins(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const subscription = webSocketObservables.subscribe((data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const livePrice: CoinPrice = JSON.parse(data);
      coins?.forEach((c) => {
        if (c.id === Object.keys(livePrice)[0]) {
          c.current_price = Number(Object.values(livePrice)[0]);
        }
        setCoins([...coins]);
    })
  });
    return () => {
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    coins,
  };
};
