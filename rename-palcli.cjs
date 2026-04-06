const fs = require('fs');
const path = require('path');

const replaceInFile = (fp) => {
    if (!fs.existsSync(fp)) return 0;
    let original = fs.readFileSync(fp, 'utf8');
    let content = original;
    
    // ENV vars first
    content = content.replace(/PALCLI_/g, 'PALSCLI_');
    // Command and string usages
    content = content.replace(/palCLI/g, 'palscli');
    content = content.replace(/PalCLI/g, 'palscli');
    content = content.replace(/pal-cli/g, 'palscli');
    content = content.replace(/palcli/g, 'palscli');
    
    // fix the specific package name from palscli1 to palscli
    content = content.replace(/"name": "palscli1"/g, '"name": "palscli"');
    
    if (original !== content) {
        fs.writeFileSync(fp, content, 'utf8');
        console.log(`Updated file: ${fp}`);
        return 1;
    }
    return 0;
};

const searchDir = (dir) => {
    const items = fs.readdirSync(dir);
    let changes = 0;
    for (const item of items) {
        // Skip dependencies, build artifacts, git
        if (['node_modules', '.next', '.git', '.gemini'].includes(item)) continue;
        const fp = path.join(dir, item);
        const stat = fs.statSync(fp);
        if (stat.isDirectory()) {
            changes += searchDir(fp);
        } else if (item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.json') || item.endsWith('.md')) {
            changes += replaceInFile(fp);
        }
    }
    return changes;
};

console.log("Starting global rename...");
searchDir('c:/projects/palCli');
console.log("Global text replacement complete.");

// Rename specific physical files/folders
try {
    const oldBin = 'c:/projects/palCli/packages/palcli/bin/palcli.js';
    const newBin = 'c:/projects/palCli/packages/palcli/bin/palscli.js';
    if (fs.existsSync(oldBin)) {
        fs.renameSync(oldBin, newBin);
        console.log("Renamed bin/palcli.js to bin/palscli.js");
    }
} catch(e) { console.error(e.message) }

try {
    const oldPkg = 'c:/projects/palCli/packages/palcli';
    const newPkg = 'c:/projects/palCli/packages/palscli';
    if (fs.existsSync(oldPkg)) {
        fs.renameSync(oldPkg, newPkg);
        console.log("Renamed packages/palcli to packages/palscli");
    }
} catch(e) { console.error(e.message) }
