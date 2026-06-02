import { handleActiSurveyResponses } from '@/server/apiCore';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleActiSurveyResponses(await jsonRequestInput(request)));
}
