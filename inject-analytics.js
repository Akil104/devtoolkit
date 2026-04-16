const fs = require('fs');
const path = require('path');

// Target directory (current directory)
const DIR = __dirname;

// Clean old analytics fetch logic regex matcher
const oldFetchRegex = /fetch\s*\(\s*["']http:\/\/localhost:5000\/api\/analytics["'][\s\S]*?\)(?:\s*\.then[\s\S]*?)?;\s*/g;

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Ignore node_modules, .git, and assets
            if (!['node_modules', '.git', 'assets'].includes(file)) {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            injectAnalytics(fullPath);
        }
    });
}

function injectAnalytics(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove old inline fetches
    if (oldFetchRegex.test(content)) {
        content = content.replace(oldFetchRegex, '');
        modified = true;
    }

    // 2. Inject new global script tag if it doesn't exist
    const relativeScriptPath = path.posix.relative(path.posix.dirname(filePath.replace(/\\/g, '/')), path.posix.join(DIR.replace(/\\/g, '/'), 'assets/js/analytics.js'));
    const SCRIPT_TAG = `<script src="${relativeScriptPath}" defer></script>\n</body>`;

    if (!content.includes('assets/js/analytics.js') && content.includes('</body>')) {
        content = content.replace('</body>', SCRIPT_TAG);
        modified = true;
        console.log(`✅ Injected into: ${path.relative(DIR, filePath)} with path ${relativeScriptPath}`);
    } else if (content.includes('assets/js/analytics.js') && content.includes('src="/assets/js/analytics.js"')) {
        // Fix the absolute path we just injected
        content = content.replace('src="/assets/js/analytics.js"', `src="${relativeScriptPath}"`);
        modified = true;
        console.log(`🔧 Fixed path for: ${path.relative(DIR, filePath)} to ${relativeScriptPath}`);
    } else if (content.includes('assets/js/analytics.js')) {
        console.log(`⚡ Already injected: ${path.relative(DIR, filePath)}`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

console.log('🚀 Starting global analytics integration...');
walkDir(DIR);
console.log('🎉 Done! All HTML pages are now tracked.');
