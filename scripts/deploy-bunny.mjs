import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const distDir = resolve('dist');
const storageZone = process.env.BUNNY_STORAGE_ZONE;
const storagePassword = process.env.BUNNY_STORAGE_PASSWORD;
const storageRegion = (process.env.BUNNY_STORAGE_REGION || '').trim().toLowerCase();
const cdnUrl = (process.env.BUNNY_CDN_URL || 'https://progotix-ec.b-cdn.net').replace(/\/$/, '');
const purgeAccessKey = process.env.BUNNY_PURGE_ACCESS_KEY;
const spaRoutes = [
  'cart',
  'wishlist',
  'checkout',
  'orders',
  'account',
  'recently-viewed',
  'compare',
  'login',
  'register',
  'flash-sale',
];

if (!storageZone || !storagePassword) {
  throw new Error(
    'Missing Bunny credentials. Set BUNNY_STORAGE_ZONE and BUNNY_STORAGE_PASSWORD before running deploy:bunny.',
  );
}

const storageHost = storageRegion
  ? `${storageRegion}.storage.bunnycdn.com`
  : 'storage.bunnycdn.com';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function listFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function storageUrl(relativePath) {
  return `https://${storageHost}/${storageZone}/${relativePath}`;
}

async function uploadFile(filePath) {
  const relativePath = relative(distDir, filePath).split(sep).join('/');
  const extension = extname(filePath).toLowerCase();
  const response = await fetch(storageUrl(relativePath), {
    method: 'PUT',
    headers: {
      AccessKey: storagePassword,
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    },
    body: readFileSync(filePath),
  });

  if (!response.ok) {
    throw new Error(`Upload failed for ${relativePath}: ${response.status} ${await response.text()}`);
  }

  console.log(`Uploaded ${relativePath}`);
}

async function deleteFile(relativePath) {
  const response = await fetch(storageUrl(relativePath), {
    method: 'DELETE',
    headers: {
      AccessKey: storagePassword,
    },
  });

  if (response.ok || response.status === 404) {
    console.log(`Deleted ${relativePath}`);
    return;
  }

  throw new Error(`Delete failed for ${relativePath}: ${response.status} ${await response.text()}`);
}

async function uploadHtml(relativePath, filePath) {
  const response = await fetch(storageUrl(relativePath), {
    method: 'PUT',
    headers: {
      AccessKey: storagePassword,
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: readFileSync(filePath),
  });

  if (!response.ok) {
    throw new Error(`Upload failed for ${relativePath}: ${response.status} ${await response.text()}`);
  }

  console.log(`Uploaded ${relativePath}`);
}

async function purgeUrl(url) {
  if (!purgeAccessKey) return;

  const response = await fetch(`https://api.bunny.net/purge?url=${encodeURIComponent(url)}`, {
    method: 'POST',
    headers: {
      AccessKey: purgeAccessKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Purge failed for ${url}: ${response.status} ${await response.text()}`);
  }

  console.log(`Purged ${url}`);
}

const files = listFiles(distDir);

for (const file of files) {
  await uploadFile(file);
}

for (const route of spaRoutes) {
  await deleteFile(route);
  await uploadHtml(`${route}/index.html`, resolve(distDir, 'index.html'));
}

await purgeUrl(`${cdnUrl}/`);
await purgeUrl(`${cdnUrl}/index.html`);
await purgeUrl(`${cdnUrl}/404.html`);
for (const route of spaRoutes) {
  await purgeUrl(`${cdnUrl}/${route}`);
  await purgeUrl(`${cdnUrl}/${route}/`);
}

console.log('Bunny deploy complete.');
