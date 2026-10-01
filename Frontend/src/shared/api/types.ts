export interface ApiEnvelope<T> {
  message: string;
  data: T;
  result: boolean;
}
