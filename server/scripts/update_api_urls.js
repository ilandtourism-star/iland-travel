const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function walkSync(dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = fs.statSync(dirFile).isDirectory()
                ? walkSync(dirFile, filelist)
                : filelist.concat(dirFile);
        } catch (err) {
            // Ignore if access denied or other errors
        }
    });
    return filelist;
}

const files = walkSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

console.log(`Found ${files.length} files. Scanning for 'https://localhost:5000/api/'...`);

let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern 1: https://localhost:5000/api/ -> /api/v1/
    content = content.replace(/https:\/\/localhost:5000\/api\//g, '/api/v1/');

    // Pattern 2: API_BASE usage
    // Check if API_BASE is defined as localhost:5000
    if (content.includes("const API_BASE = 'https://localhost:5000';")) {
        content = content.replace("const API_BASE = 'https://localhost:5000';", "const API_BASE = '';");
    }

    // Pattern 3: `${API_BASE}/api/ -> `${API_BASE}/api/v1/
    // If API_BASE is empty string, this becomes /api/v1/
    if (content.includes("`${API_BASE}/api/")) {
        content = content.replace(/`\$\{API_BASE\}\/api\//g, "`${API_BASE}/api/v1/");
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${path.relative(srcDir, file)}`);
        count++;
    }
});

console.log(`\nUpdated ${count} files.`);
