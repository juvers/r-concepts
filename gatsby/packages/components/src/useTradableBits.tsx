import {useState, useEffect, useRef} from 'react';

export interface TradableBitsProps {
  /**
   * Labels are basically a slugified version of hashtags
   * if a label doesn't seem to be pulling the correct data,
   * make sure its labeled correctly in tradablebits.
   * Most of the time its just a lower cased version of the
   * hashtag, but sometimes some one screws up and puts "-"
   * or other identifiers
   *
   * defaults to ['rockcenter', 'topoftherock', 'rainbowroom']
   */
  labels?: string[];
  /**
   * The max number of items to be requested from api
   *
   * defaults to 10
   */
  maxItems?: number;
  /**
   * The social media platform to pull data from
   *
   * defaults to ['twitter', 'instagram']
   */
  network?: string[];
}
// TODO: This Record will need to be updated once we know what
// data we will be using to build out tradable bits functionality
export interface TradableBitsRecord {
  /** image url from social media post */
  image_url: string;
  /** Caption of social media post */
  caption: string;
  /** URL of the social media post */
  record_url?: string;
  /** key of the social media post */
  record_key: string;
  /** author image of the social media post */
  author_image_url?: string;
  /** author name of the social media post */
  author_screen_name?: string;
  /** timestamp of the social media post in unix format :shrug: */
  creation_timestamp: number;
}

export const useTradableBits = ({
  labels = ['rockcenter', 'topoftherock', 'rainbowroom'],
  maxItems = 10,
  network = ['twitter', 'instagram'],
}: Partial<TradableBitsProps> = {}): TradableBitsRecord[] | null => {
  const isMounted = useRef(false);

  const [data, setData] = useState<TradableBitsRecord[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Throw error outside of useEffect.
  //This allows ErrorBoundary to catch the error
  if (error) throw error;

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      const encodedNetwork = encodeURIComponent(network?.join(','));
      const encodedLabels = encodeURIComponent(labels?.join(','));
      const response = await fetch(
        `https://tradablebits.com/streams/api/rockcenternyc/records?limit=${maxItems}&networks=${encodedNetwork}&label=${encodedLabels}`,
      );
      const {data} = (await response.json()) as {data: TradableBitsRecord[]};
      if (isMounted.current === true) setData(data);
    };
    if (!data && !error) {
      fetchData().catch((error) => setError(new Error(error)));
    }
    return () => {
      isMounted.current = false;
    };
  }, [labels, maxItems, network, data, error]);

  return data;
};
