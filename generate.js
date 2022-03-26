
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import fs from 'fs';
import path from 'path';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const docsPath = './docs';

// const remarkProcessor = await remark().use(remarkParse);

const readdirRecursiveSync = (dirPath) => {
    const out = {};
    const dirs = fs.readdirSync(dirPath);
    
    for (const dir of dirs) {
        if (fs.lstatSync(path.resolve(docsPath, dir)).isDirectory()) {
            out[dir] = readdirRecursiveSync(path.resolve(dirPath, dir));
        } else {
            out[dir] = fs.readFileSync(path.resolve(dirPath, dir)).toString();
        }
    }

    return out;
}

const getDocFiles = () => {
    return readdirRecursiveSync(docsPath);;
}

export async function generateDocs(format) {
    const filesStruct = getDocFiles();
    
    for (const [name, file] of Object.entries(filesStruct)) {
        if (typeof file === 'string')
            console.log(await unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkRehype)
                .use(rehypeSanitize)
                .use(rehypeStringify)
                .process(file))
    }
}

await generateDocs();
