import fs from 'fs';
import path from 'path';

import { readPathsRecursiveSync } from './utils.js';

const transformLinks = (links, name = 'Metarhia Documentation') => {
    const navbar = [];
    let index = '';

    for (const [name, link] of Object.entries(links)) {
        if (typeof link === 'string') {
            if (name === 'index') {
                index = link;
            }else {
                navbar.push(`<li><a href=${link}>${name}</a></li>`);
            }
        } else {
            navbar.push(transformLinks(link, name));
        }
    }

    return `<a href=${index}>${name}</a><ul>${navbar.join('')}</ul>`
}

export const combineWithTemplate = (html, name = 'Metarhia Documentation') => {
    const template = fs.readFileSync(path.resolve('./tool/template.html')).toString();
    const links = readPathsRecursiveSync('./docs');

    const navbar = transformLinks(links);

    return template.replace('__CONTENT__', html)
                   .replace('__LINKS__', navbar)
                   .replace('__STATIC__', '')
                   .replace('__TITLE__', name);
}
