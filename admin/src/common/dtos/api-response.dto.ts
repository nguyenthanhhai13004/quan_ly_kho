export interface ApiResponseDto<T> {
  status: number;
  message: string;
  data: T;
}
