import * as path from 'path';
import * as yup from 'yup';
import { memo } from './utils';
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

export const env = memo((environment = process.env) => {
  const schema = yup.object().shape({
    REPO_PATH: yup.string().required(),
    GITHUB_TOKEN: yup.string().required().min(10),
    NPM_TOKEN: yup.string().required().min(10),
  });
  const fromEnv = schema.validateSync(environment);
  return {
    ...fromEnv,
    DATA_PATH: path.resolve(fromEnv.REPO_PATH, 'data/git.json'),
  };
});
