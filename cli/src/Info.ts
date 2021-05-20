import * as yup from 'yup';

/**
 * Information interface
 */
export interface Info {
  repo: string;
  owner: string;
  topics: string[];
  keywords: string[];
  name: string;
  size: number;
  stars: number;
  description: string;
}

/**
 * Information Schema
 */
export const InfoSchema = yup.object().shape({
  repo: yup.string().required(),
  owner: yup.string().required(),
  topics: yup.array().of(yup.string()),
  keywords: yup.array().of(yup.string()),
  name: yup.string().required(),
  size: yup.number().required(),
  stars: yup.number().required(),
  description: yup.string().required(),
});
