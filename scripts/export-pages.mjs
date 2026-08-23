import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function patchFilesRecursively(dir, normalizedBasePath) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await patchFilesRecursively(fullPath, normalizedBasePath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") ||
        entry.name.endsWith(".css") ||
        entry.name.endsWith(".json"))
    ) {
      let content = await fs.readFile(fullPath, "utf-8");
      let updated = content
        .replaceAll('"/_next/', `"${normalizedBasePath}_next/`)
        .replaceAll("'/_next/", `'${normalizedBasePath}_next/`)
        .replaceAll('"/logo-ckjs.jpg"', `"${normalizedBasePath}logo-ckjs.jpg"`)
        .replaceAll("'/logo-ckjs.jpg'", `'${normalizedBasePath}logo-ckjs.jpg'`);
      if (content !== updated) {
        await fs.writeFile(fullPath, updated, "utf-8");
      }
    }
  }
}

async function exportForGitHubPages() {
  const basePath =
    process.env.BASE_PATH || "/CV-CIPTA-KARYA-JAYA-SENTOSA-prototype/";
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, "dist");
  const clientDir = path.join(distDir, "client");
  const serverEntry = path.join(distDir, "server", "index.js");
  const outDir = path.join(rootDir, "dist-pages");

  console.log(`[export] Target Base Path: ${normalizedBasePath}`);
  console.log("[export] Step 1: Building project with vinext...");
  execSync("npx vinext build", { stdio: "inherit", cwd: rootDir });

  console.log("[export] Step 2: Preparing output directory...");
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  console.log("[export] Step 3: Copying client assets...");
  await copyDir(clientDir, outDir);

  console.log("[export] Step 4: Generating pre-rendered HTML via SSR worker...");
  const workerUrl = new URL(`file://${serverEntry.replace(/\\/g, "/")}`);
  workerUrl.searchParams.set("export", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to render SSR HTML: Status ${response.status}`);
  }

  let html = await response.text();

  console.log("[export] Step 5: Adjusting asset paths for GitHub Pages subpath...");
  // Replace absolute root paths with base path
  html = html
    .replaceAll('href="/_next/', `href="${normalizedBasePath}_next/`)
    .replaceAll('src="/_next/', `src="${normalizedBasePath}_next/`)
    .replaceAll('data-rsc-css-href="/_next/', `data-rsc-css-href="${normalizedBasePath}_next/`)
    .replaceAll('":HL[\\"/_next/', `":HL[\\"${normalizedBasePath}_next/`)
    .replaceAll('"css:/_next/', `"css:${normalizedBasePath}_next/`)
    .replaceAll('href="/favicon.svg"', `href="${normalizedBasePath}favicon.svg"`)
    .replaceAll('href="/og.png"', `href="${normalizedBasePath}og.png"`)
    .replaceAll('content="http://localhost:3000/og.png"', `content="https://iamikhsank.github.io${normalizedBasePath}og.png"`)
    .replaceAll('src="/logo-ckjs.jpg"', `src="${normalizedBasePath}logo-ckjs.jpg"`)
    .replaceAll('"/logo-ckjs.jpg"', `"${normalizedBasePath}logo-ckjs.jpg"`)
    .replaceAll('href="/file.svg"', `href="${normalizedBasePath}file.svg"`)
    .replaceAll('href="/globe.svg"', `href="${normalizedBasePath}globe.svg"`)
    .replaceAll('href="/window.svg"', `href="${normalizedBasePath}window.svg"`);

  // Write index.html and 404.html for SPA routing fallback
  await fs.writeFile(path.join(outDir, "index.html"), html, "utf-8");
  await fs.writeFile(path.join(outDir, "404.html"), html, "utf-8");

  // Create .nojekyll so GitHub Pages does not ignore _next folder
  await fs.writeFile(path.join(outDir, ".nojekyll"), "", "utf-8");

  console.log("[export] Step 6: Patching client-side bundles with target base path...");
  await patchFilesRecursively(outDir, normalizedBasePath);

  console.log("[export] Export complete! Static build generated in dist-pages/");
}

exportForGitHubPages().catch((err) => {
  console.error("[export] Error during export:", err);
  process.exit(1);
});
