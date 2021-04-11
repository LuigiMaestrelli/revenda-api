import fs from 'fs';
import path from 'path';

export default {
    getFileList(dir: string, excludes: string[] = []): string[] {
        let files: string[] = [];

        const dirData = fs.readdirSync(dir);
        dirData.forEach(file => {
            const filepath = path.join(dir, file);
            const stat = fs.lstatSync(filepath);

            if (stat.isDirectory()) {
                files = files.concat(this.getFileList(filepath, excludes));
                return;
            }

            if (excludes.includes(file)) {
                return;
            }

            files.push(filepath);
        });

        return files;
    }
};
