import { handleSceneScore } from '@/server/sceneScore';
import { jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleSceneScore(request));
}
