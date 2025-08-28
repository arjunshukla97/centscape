export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
export interface PreviewData {
  title: string;
  image: string;
  price: string;
  currency?: string;
  siteName: string;
  sourceUrl: string;
}


export function successResponse<T>(status: number, data: T): ApiResponse<T> {
  return {
    success: true,
    status,
    data,
  };
}

export function errorResponse(
  status: number,
  message: string,
  code?: string,
): ApiResponse<null> {
  return {
    success: false,
    status,
    error: {message, code},
  };
}
