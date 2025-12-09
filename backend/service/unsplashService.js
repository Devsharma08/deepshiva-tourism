import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';

const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY, fetch });

export const getDestinationImage = async (query) => {
  const result = await unsplash.search.getPhotos({
    query: query, // e.g., "Paris Landmarks"
    page: 1,
    perPage: 1,
    orientation: 'landscape',
  });
  
  if (result.response) {
    return result.response.results[0].urls.regular;
  }
  return "https://via.placeholder.com/800x400?text=No+Image+Found";
};