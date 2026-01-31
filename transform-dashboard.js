const fs = require('fs');

const filePath = 'src/app/services/dashboard.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace inv.periodo usage 
content = content.replace(/inv\.periodo/g, '`${inv.mes} ${inv.año}`');

// Replace the parsePeriodo method definition to use mes and año
const oldParsePeriodo = /private parsePeriodo\(periodo: string\): Date \{[\s\S]*?return new Date\(\); \/\/ Fallback\s+\}/;
const newParsePeriodo = `private parsePeriodoFrom(mes: string, año: number): Date {
        const months: { [key: string]: number } = {
            'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo':  4, 'Junio': 5,
            'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
        };
        const monthIndex = months[mes];
        if (monthIndex !== undefined) {
            return new Date(año, monthIndex, 1);
        }
        return new Date(); // Fallback
    }`;

content = content.replace(oldParsePeriodo, newParsePeriodo);

// Replace calls to parsePeriodo
content = content.replace(/this\.parsePeriodo\(a\.periodo\)/g, 'this.parsePeriodoFrom(a.mes, a.año)');
content = content.replace(/this\.parsePeriodo\(b\.periodo\)/g, 'this.parsePeriodoFrom(b.mes, b.año)');
content = content.replace(/this\.parsePeriodo\(inv\.periodo\)/g, 'this.parsePeriodoFrom(inv.mes, inv.año)');

// For getTrendData, replace the split logic since we now have mes and año as separate fields
const oldTrendLogic = /const parts = inv\.periodo\.split\(' '\);\s+const monthName = parts\[0\];\s+const year = parts\[1\];/g;
const newTrendLogic = `const monthName = inv.mes;\n                    const year = inv.año.toString();`;
content = content.replace(oldTrendLogic, newTrendLogic);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ dashboard.service.ts transformed successfully');
