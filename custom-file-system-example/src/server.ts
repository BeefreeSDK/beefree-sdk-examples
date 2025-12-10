import fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import staticPlugin from '@fastify/static';
import path from 'path';
import dotenv from 'dotenv';
import { FileSystemHandler } from './filesystem.js';
import { fileURLToPath } from 'url';

// Load env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '3000');
const STORAGE_ROOT = process.env.STORAGE_ROOT || './storage';
// Ensure absolute path for static serving
const ABSOLUTE_STORAGE_ROOT = path.resolve(STORAGE_ROOT);
const PUBLIC_URL_BASE = process.env.PUBLIC_URL_BASE || `http://localhost:${PORT}/files`;

const fsHandler = new FileSystemHandler(STORAGE_ROOT, PUBLIC_URL_BASE);

// Register plugins
server.register(cors, { origin: '*' }); // For dev
server.register(formbody);

// Serve static files
server.register(staticPlugin, {
  root: ABSOLUTE_STORAGE_ROOT,
  prefix: '/files/',
});

// Authentication Middleware
server.addHook('onRequest', async (request, _reply) => {
  // Skip auth for static files and auth endpoint
  if (request.url.startsWith('/files/') || request.url.startsWith('/auth/token')) return;
  
  // In a real app, validate these against your credentials
  const authHeader = request.headers.authorization;
  
  // For this example, we just check presence to simulate security
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // reply.code(401).send({ status: 'error', message: 'Missing Authorization header' });
    // return;
    // Allowing for demo purposes if user doesn't configure it
  }
});

// Beefree authentication endpoint
server.post('/auth/token', async (request, reply) => {
  try {
    const body = request.body as { uid?: string } | undefined;
    const uid = body?.uid;
    // Fallback to env UID if not provided
    const userUid = uid || process.env.BEEFREE_UID || 'custom-fs-user';
    
    const clientId = process.env.BEEFREE_CLIENT_ID;
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      request.log.error('Missing Beefree credentials');
      return reply.code(500).send({ 
        error: 'Server configuration error', 
        details: 'Missing Beefree credentials' 
      });
    }

    request.log.info(`🔐 Authenticating user: ${userUid}`);
    
    const response = await fetch('https://auth.getbee.io/loginV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        uid: userUid
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      request.log.error(`❌ Beefree auth error: ${errorText}`);
      return reply.code(response.status).send({
        error: 'Authentication failed',
        details: errorText
      });
    }

    const tokenData = await response.json();
    request.log.info('✅ Authentication successful');
    return tokenData;
    
  } catch (error: any) {
    request.log.error(`❌ Authentication error: ${error.message}`);
    return reply.code(500).send({
      error: 'Authentication failed',
      details: error.message || 'Unknown error'
    });
  }
});

// Health check endpoint
server.get('/health', async (_request, _reply) => {
  return { status: 'healthy' };
});

// Routes

// LIST or GET METADATA
server.get('/*', async (request, reply) => {
  try {
    // Fastify might normalize URL, let's use raw url or params
    const urlPath = (request.params as any)['*'] || '';
    
    // Check if this is one of our special routes handled above
    if (urlPath === 'health' || urlPath === 'auth/token') return; // Should be handled by specific routes if matched

    // Check for trailing slash in original url to distinguish dir listing vs file meta
    const isDirectory = request.url.split('?')[0].endsWith('/') || urlPath === '';

    if (isDirectory) {
      // List directory
      const files = await fsHandler.listDirectory(urlPath);
      return { status: 'success', data: files };
    } else {
      // File metadata
      const meta = await fsHandler.getMetadata(urlPath);
      if (!meta) {
        return reply.code(404).send({
          code: 3200,
          message: "Resource Not Found",
          details: "Resource does not exist"
        });
      }
      return { status: 'success', data: { meta } };
    }
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ status: 'error', message: error.message });
  }
});

// CREATE DIRECTORY or UPLOAD FILE
server.post('/*', async (request, reply) => {
  try {
    const urlPath = (request.params as any)['*'] || '';
    const isDirectory = request.url.split('?')[0].endsWith('/');

    if (isDirectory) {
      // Create Directory
      const meta = await fsHandler.createDirectory(urlPath);
      return { status: 'success', data: { meta } };
    } else {
      // Upload File
      const body = request.body as { source: string, conflict_strategy?: 'keep' | 'replace' | 'ask' };
      if (!body.source) {
        return reply.code(400).send({ status: 'error', message: 'Missing source URL' });
      }

      const result = await fsHandler.saveFile(urlPath, body.source, body.conflict_strategy);
      
      if (result.conflict) {
        return reply.code(200).send({ code: 3400, message: "Resource Already Present" });
      }

      return { status: 'success', data: { meta: result.meta } };
    }
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ status: 'error', message: error.message });
  }
});

// DELETE
server.delete('/*', async (request, reply) => {
  try {
    const urlPath = (request.params as any)['*'] || '';
    await fsHandler.deleteResource(urlPath);
    return { status: 'success', data: null };
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ status: 'error', message: error.message });
  }
});

// MOVE (PATCH)
server.patch('/*', async (request, reply) => {
  try {
    const urlPath = (request.params as any)['*'] || '';
    const body = request.body as { new_path: string, conflict_strategy?: string };
    
    if (!body.new_path) {
      return reply.code(400).send({ status: 'error', message: 'Missing new_path' });
    }

    const result = await fsHandler.moveResource(urlPath, body.new_path, body.conflict_strategy || '');

    if (result.conflict) {
      return reply.send({ code: 3400, message: "Resource Already Present" });
    }

    return { status: 'success', data: { meta: result.meta } };
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ status: 'error', message: error.message });
  }
});

const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    
    // Check environment variables
    const clientId = process.env.BEEFREE_CLIENT_ID;
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET;
    const uid = process.env.BEEFREE_UID || 'custom-fs-user';
    
    console.log(`
🚀 Beefree Custom File System Provider Example
   
   Server running at: http://localhost:${PORT}
   Storage root: ${ABSOLUTE_STORAGE_ROOT}
   
   API Endpoints:
   • GET/POST/DELETE/PATCH /* - File System Operations
   • POST /auth/token         - Beefree SDK Authentication
   • GET /health              - Health Check
   
   Environment:
   • BEEFREE_CLIENT_ID: ${clientId ? '✅ Set' : '❌ Missing'}
   • BEEFREE_CLIENT_SECRET: ${clientSecret ? '✅ Set' : '❌ Missing'}
   • BEEFREE_UID: ${uid}
   
   ${(!clientId || !clientSecret) ? '⚠️  Warning: Beefree credentials missing. Auth endpoint will fail.' : '✅ Ready for operations!'}
  `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
