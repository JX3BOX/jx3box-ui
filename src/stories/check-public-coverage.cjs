const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const indexFile = path.join(root, "index.js");
const storiesRoot = path.join(root, "src/stories");

function walk(dir, matcher, files = []) {
    for (const name of fs.readdirSync(dir)) {
        const file = path.join(dir, name);
        const stat = fs.statSync(file);
        if (stat.isDirectory()) {
            walk(file, matcher, files);
        } else if (matcher(file)) {
            files.push(file);
        }
    }
    return files;
}

function normalize(file) {
    return path.relative(root, file).replace(/\\/g, "/");
}

function readPublicComponents() {
    const content = fs.readFileSync(indexFile, "utf8");
    return [...content.matchAll(/^import\s+([\w$]+)\s+from\s+["'](.+?\.vue)["'];/gm)].map((match) => {
        const importPath = match[2].replace(/^\.\//, "");
        return {
            name: match[1],
            file: importPath,
        };
    });
}

function readStoryImports() {
    const stories = walk(storiesRoot, (file) => /\.stories\.(js|jsx|ts|tsx|mdx)$/.test(file));
    const imported = new Set();

    for (const story of stories) {
        const content = fs.readFileSync(story, "utf8");
        const storyDir = path.dirname(story);
        for (const match of content.matchAll(/from\s+["'](.+?\.vue)["']/g)) {
            const resolved = path.resolve(storyDir, match[1]);
            imported.add(normalize(resolved));
        }
    }

    return imported;
}

const components = readPublicComponents();
const storyImports = readStoryImports();
const missing = components.filter((item) => !storyImports.has(item.file));

if (missing.length) {
    console.error("Missing Storybook stories for public exports:");
    for (const item of missing) {
        console.error(`- ${item.name}: ${item.file}`);
    }
    process.exit(1);
}

console.log(`Storybook public export coverage OK: ${components.length}/${components.length}`);
