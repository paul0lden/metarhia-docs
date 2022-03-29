import fs from 'fs';
import path from 'path';

export const readFilesRecursiveSync = (dirPath) => {
    const out = {};
    const dirs = fs.readdirSync(dirPath);
    
    for (const dir of dirs) {
        if (fs.lstatSync(path.resolve(dirPath, dir)).isDirectory()) {
            out[dir] = readFilesRecursiveSync(path.resolve(dirPath, dir));
        } else {
            out[dir.replace(/\.[^/.]+$/, '')] = fs.readFileSync(path.resolve(dirPath, dir)).toString();
        }
    }

    return out;
}

export const readPathsRecursiveSync = (dirPath) => {
    const out = {};
    const dirs = fs.readdirSync(dirPath);
    
    for (const dir of dirs) {
        if (fs.lstatSync(path.join(dirPath, dir)).isDirectory()) {
            out[dir] = readPathsRecursiveSync(path.join(dirPath, dir));
        } else {
            out[dir.replace(/\.[^/.]+$/, '')] = path.join(dirPath, dir)
                .replace(/\.[^/.]+$/, '')
                .replace('index', '')
                .replace('docs', '');
        }
    }

    return out;
}
