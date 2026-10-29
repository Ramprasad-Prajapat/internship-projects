import { search } from '../services/api';
import axios from 'axios';

jest.mock('axios', () => {
  const mAxios = {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    create: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
    },
  };
  mAxios.create.mockReturnValue(mAxios);
  return mAxios;
});

describe('API Service', () => {
  test('search sends correct URL query parameters', async () => {
    await search('cricket', 'live', 1, 10);
    expect(axios.get).toHaveBeenCalledWith('/search?q=cricket&filter=live&page=1&size=10');
  });

  test('search handles empty filter and default pagination', async () => {
    await search('test');
    expect(axios.get).toHaveBeenCalledWith('/search?q=test&page=0&size=20');
  });
});
