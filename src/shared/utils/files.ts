import fs from 'fs';

export default {
    getFileList(dir: string, excludes: string[]): string[] {
        let files: string[] = [];

        fs.readdirSync(dir).forEach(file => {
            const filepath = `${dir}/${file}`;
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
