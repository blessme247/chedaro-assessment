interface ErrorResponse {
  message?: string;
  error?: string;
}

interface CustomError {
  message: string;
}

interface HttpRequestConfig extends Omit<RequestInit, 'body' | 'method'> {
  body?: any;
  uploader?: boolean;
  method?: string;
}

const checkStatus = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    const message = await response.text();
    const err: ErrorResponse = JSON.parse(message);
    throw Object.freeze({ 
      message: err.message || err.error || 'Unknown error' 
    } as CustomError);
  }
  return response;
};

const parseJSON = (response: Response): Promise<any> => response.json();

export async function httpRequest<T = any>(
  uri: string, 
  { body, ...customConfig }: HttpRequestConfig = {}
): Promise<T> {
  const headers: HeadersInit = customConfig.uploader 
    ? {} 
    : { 
        Accept: 'application/json', 
        'Content-Type': 'application/json' 
      };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    },
  };

  if (body) {
    config.body = customConfig.uploader ? body : JSON.stringify(body);
  }

  const response = await fetch(uri, config);
  const result = await checkStatus(response);
  return parseJSON(result);
}