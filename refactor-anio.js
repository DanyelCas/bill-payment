const fs = require('fs');
const glob = require('glob');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Replace property access .año with .anio
    content = content.replace(/\.año\b/g, '.anio');

    // 2. Replace interface/type properties matching año
    // e.g. "año: number;" -> "anio: number;"
    content = content.replace(/\baño:\s/g, 'anio: ');

    // 3. Replace JSON keys (for db.json and potentially formatting)
    // "año": -> "anio":
    content = content.replace(/"año":/g, '"anio":');

    // 4. Replace form control names
    // formControlName="año" -> formControlName="anio"
    content = content.replace(/formControlName="año"/g, 'formControlName="anio"');

    // 5. Replace simple object keys in TS
    // key: 'año' -> key: 'anio' (for table columns mostly)
    content = content.replace(/key:\s*'año'/g, "key: 'anio'");

    // 6. Fix user interactions in templates (template variables if any)
    // let-año -> let-anio (unlikely but safe)

    // 7. Fix dashboard service method name mismatch
    // this.parsePeriodo( -> this.parsePeriodoFrom(
    if (filePath.endsWith('dashboard.service.ts')) {
        content = content.replace(/this\.parsePeriodo\(/g, 'this.parsePeriodoFrom(');
        // Fix the specific broken call with template string logic if it persisted
        // The previous error showed: this.parsePeriodo(`${inv.mes} ${inv.año}`) which is now .anio
        // But wait, the previous fix might have left it mixed.
        // Let's ensure strict correction:
        content = content.replace(/this\.parsePeriodoFrom\(`\$\{inv\.mes\} \$\{inv\.anio\}`\)/g, 'this.parsePeriodoFrom(inv.mes, inv.anio)');
        content = content.replace(/this\.parsePeriodoFrom\(`\$\{inv\.mes\} \$\{inv\.año\}`\)/g, 'this.parsePeriodoFrom(inv.mes, inv.anio)');
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

// Get all relevant files
const files = glob.sync('src/**/*.{ts,html,json}', { ignore: ['**/node_modules/**'] });

files.forEach(file => {
    replaceInFile(file);
});
