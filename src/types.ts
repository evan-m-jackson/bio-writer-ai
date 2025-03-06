export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type FieldOfLaw = {
  field: string;
  years: string;
};

export type OpenaiResponse = {
  status: number;
  data: string;
  error: string;
}