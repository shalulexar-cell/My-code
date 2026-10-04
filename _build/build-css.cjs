const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'quickdocs-css-'));
try {
  const input = path.join(temp, 'input.css');
  fs.writeFileSync(input, fs.readFileSync(path.join(__dirname, 'input.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'styles.css'), 'utf8'));
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '-c', path.join(__dirname, 'tailwind.config.js'), '-i', input, '-o', path.join(root, 'assets/site.css'), '--minify'], { stdio: 'inherit' });
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
