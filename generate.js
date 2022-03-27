import { unified } from 'unified';
import remarkParse from 'remark-parse';
import fs from 'fs';
import path from 'path';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const docsPath = './docs';

const readdirRecursiveSync = (dirPath) => {
    const out = {};
    const dirs = fs.readdirSync(dirPath);
    
    for (const dir of dirs) {
        if (fs.lstatSync(path.resolve(docsPath, dir)).isDirectory()) {
            out[dir] = readdirRecursiveSync(path.resolve(dirPath, dir));
        } else {
            out[dir.replace(/\.[^/.]+$/, '')] = fs.readFileSync(path.resolve(dirPath, dir)).toString();
        }
    }

    return out;
}

const generateHtmlFiles = async (file) => {
    return await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(file);
}

const writeFileRecursively = async (data, callback, dir) => {

    for (const [name, file] of Object.entries(data)) {
        if (typeof file === 'string') {
            const fileAbsolutePath = path.resolve(path.join(dir, name) + '.html');
            fs.writeFileSync(fileAbsolutePath, file);
        }
    }
}

export async function generateDocs(format) {
    const docfiles = readdirRecursiveSync(docsPath);

    console.log(await writeFileRecursively(docfiles, generateHtmlFiles, docsPath))
}

await generateDocs();
