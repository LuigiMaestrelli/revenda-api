import fs from 'fs';
import path from 'path';

export const getFileList = (dir: string, excludes: string[] = []): string[] => {
    let files: string[] = [];

    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        const stat = fs.lstatSync(filepath);

        if (stat.isDirectory()) {
            files = files.concat(getFileList(filepath, excludes));
            return;
        }

        if (excludes.includes(file)) {
            return;
        }

        files.push(filepath);
    });

    return files;
};

export const isValidMimeType = (acceptedMime: string[], mimetype: string): boolean => {
    if (!acceptedMime.map(p => p.toLowerCase()).includes(mimetype.toLowerCase())) {
        return false;
    }

    return true;
};
