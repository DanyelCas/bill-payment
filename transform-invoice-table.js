const fs = require('fs');

const filePath = 'src/app/components/user/invoices/invoice-table/invoice-table.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all invoice.periodo references with template string
content = content.replace(/invoice\.periodo/g, '`${invoice.mes} ${invoice.año}`');

// Replace all inv.periodo references
content = content.replace(/inv\.periodo/g, '`${inv.mes} ${inv.año}`');

// Replace all a.periodo in sort comparisons
content = content.replace(/a\.periodo/g, '`${a.mes} ${a.año}`');

// Replace all b.periodo in sort comparisons
content = content.replace(/b\.periodo/g, '`${b.mes} ${b.año}`');

// Now replace the parsePeriodo method calls with new logic
content = content.replace(/this\.parsePeriodo\(invoice\.periodo\)/g, 'this.parsePeriodoFrom(invoice.mes, invoice.año)');
content = content.replace(/this\.parsePeriodo\(inv\.periodo\)/g, 'this.parsPeriodoFrom(inv.mes, inv.año)');
content = content.replace(/this\.parsePeriodo\(a\.periodo\)/g, 'this.parsePeriodoFrom(a.mes, a.año)');
content = content.replace(/this\.parsePeriodo\(b\.periodo\)/g, 'this.parsePeriodoFrom(b.año)');

// Replace the parsePeriodo method definition
const oldParsePeriodo = /private parsePeriodo\(periodo: string\): Date \{[\s\S]*?return new Date\(year, monthIndex, 1\);\s+\}/;
const newParsePeriodo = `private parsePeriodoFrom(mes: string, año: number): Date {
    const monthMap: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    const monthIndex = monthMap[mes.toLowerCase()];
    if (monthIndex === undefined) return new Date();
    return new Date(año, monthIndex, 1);
  }`;

content = content.replace(oldParsePeriodo, newParsePeriodo);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ invoice-table.component.ts transformed successfully');
