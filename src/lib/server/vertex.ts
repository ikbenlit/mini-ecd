import { VertexAI } from '@google-cloud/vertexai';
import fs from 'node:fs';

type ServiceAccount = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

function decodeBase64Maybe(value: string): string {
  try {
    return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return value;
  }
}

function loadServiceAccountFromEnv(): ServiceAccount | null {
  const base64 = process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64;
  const raw = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (base64 && base64.trim().length > 0) {
    const decoded = decodeBase64Maybe(base64);
    return JSON.parse(decoded) as ServiceAccount;
  }
  if (raw && raw.trim().length > 0) {
    return JSON.parse(raw) as ServiceAccount;
  }
  return null;
}

function loadServiceAccountFromFile(): ServiceAccount | null {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFile) return null;
  if (!fs.existsSync(keyFile)) return null;
  const json = fs.readFileSync(keyFile, 'utf8');
  return JSON.parse(json) as ServiceAccount;
}

export function getVertex() {
  const project = process.env.GCP_PROJECT_ID;
  const location = process.env.VERTEX_LOCATION || 'europe-west1';
  if (!project) {
    throw new Error('GCP_PROJECT_ID ontbreekt in env');
  }

  const sa = loadServiceAccountFromEnv() ?? loadServiceAccountFromFile();
  if (!sa) {
    throw new Error(
      'Geen service account credentials gevonden. Stel GCP_SERVICE_ACCOUNT_JSON(_BASE64) of GOOGLE_APPLICATION_CREDENTIALS in.'
    );
  }

  const vertex = new VertexAI({
    project,
    location,
    // Auth via in-memory credentials
    googleAuthOptions: {
      credentials: {
        client_email: sa.client_email,
        private_key: sa.private_key,
      },
    },
  } as unknown as ConstructorParameters<typeof VertexAI>[0]);

  function getModel(modelName?: string) {
    const model = modelName || process.env.VERTEX_MODEL || 'gemini-1.5-pro';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generativeModel: any = vertex.getGenerativeModel({ model });
    return generativeModel;
  }

  return { client: vertex, getModel };
}


