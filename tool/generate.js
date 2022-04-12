import fs from 'fs';
import process from 'process';
import path from 'path';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

import { readFilesRecursiveSync } from './utils.js';
import { combineWithTemplate } from './html.js';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

const docsPath = process.env.DOCS_PATH ? process.env.DOCS_PATH : './docs';

const generateHtmlFiles = async (file) => {
    const parsedMD = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(file);

  return combineWithTemplate(parsedMD);
};

const writeFileRecursively = async (files, dir, callback) => {
  for (const [name, file] of Object.entries(files)) {
    if (typeof file === 'string') {
      const fileAbsolutePath = path.resolve(path.join(dir, name) + '.html');

      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      fs.writeFileSync(fileAbsolutePath, await callback(file));
    } else {
      writeFileRecursively(file, path.join(dir, name), callback);
    }
  }
};

// todo add minifier
const minifyCss = (file) => {
  return file;
};

// todo add minifier
const minifyJs = (file) => {
  return file;
};

const buildStatic = (staticDirPath, outDirPath) => {
  const staticDir = fs.readdirSync(staticDirPath);
  for (const file of staticDir) {
    const ext = path.extname(file);
    if (!file.includes('.min.')) {
      if (ext === '.css') minifyCss(file);
      else if (ext === '.js') minifyJs(file);
      else continue;
    }
    const src = path.join(staticDirPath, file);
    const dest = path.join(outDirPath, file);
    const isDir = fs.existsSync(outDirPath);
    if (!isDir) fs.mkdirSync(outDirPath);
    fs.copyFileSync(src, dest);
  }
};

export async function generateDocs(format) {
  const docfiles = readFilesRecursiveSync(docsPath);

  buildStatic(path.resolve('./static'), path.resolve('./.dist'));

  await writeFileRecursively(docfiles, path.resolve('./.dist'), generateHtmlFiles);
}
