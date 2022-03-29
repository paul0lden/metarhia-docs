import fs from 'fs';
import process from 'process';
import path from 'path';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkPrism from 'remark-prism';
import remarkGfm from 'remark-gfm';

import { readFilesRecursiveSync } from './utils.js';
import { combineWithTemplate } from './html.js';

const docsPath = process.env.DOCS_PATH ? process.env.DOCS_PATH : './docs';

const generateHtmlFiles = async (file) => {
    const parsedMD = await unified()
        .use(remarkParse)
        .use(remarkPrism)
        .use(remarkGfm)
        .use(remarkHtml)
        .process(file);

    return combineWithTemplate(parsedMD); 
}

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
}

// todo add minifier
const minifyCss = (file) => {
    return file;
}

// todo add minifier
const minifyJs = (file) => {
    return file;
}

const buildStatic = (staticDirPath, outDirPath) => {
    const staticDir = fs.readdirSync(staticDirPath);
    
    for (const file of staticDir) {
        if (!file.includes('.min.')) {
            if (path.extname(file) === '.css') {
                minifyCss(file);
            } else if (path.extname(file) === '.js') {
                minifyJs(file);
            }
        }

        if (fs.existsSync(path.join(outDirPath, file))) { 
            fs.rmSync(path.join(outDirPath, file));
        }
        fs.copyFileSync(path.join(staticDirPath, file), path.join(outDirPath, file));
    }
}

export async function generateDocs(format) {
    const docfiles = readFilesRecursiveSync(docsPath);

    buildStatic(path.resolve('./static'), path.resolve('./.dist'));

    await writeFileRecursively(docfiles, path.resolve('./.dist'), generateHtmlFiles)
}
