import { Info, InfoSchema } from './Info';
import * as fs from 'fs-extra';
import { env } from './env';

/**
 * Save to json
 */
export async function appendJsonAndSave(info: Info): Promise<Record<string, Info>> {
  InfoSchema.validateSync(info);
  const json = await fs.readJSON(env().DATA_PATH);
  const data = { ...json, [`${info.owner}/${info.repo}`]: info };
  await fs.writeJSON(env().DATA_PATH, data, { spaces: 2 });
  return data;
}
