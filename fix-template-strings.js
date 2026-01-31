const fs = require('fs');

// Fix invoice-table.component.ts - replace template strings with proper concatenation
const invoiceTablePath = 'src/app/components/user/invoices/invoice-table/invoice-table.component.ts';
let content = fs.readFileSync(invoiceTablePath, 'utf8');

// Replace template strings with string concatenation for Angular compatibility
content = content.replace(/`\$\{invoice\.mes\} \$\{invoice\.año\}`/g, 'invoice.mes + " " + invoice.año');
content = content.replace(/`\$\{inv\.mes\} \$\{inv\.año\}`/g, 'inv.mes + " " + inv.año');
content = content.replace(/`\$\{a\.mes\} \$\{a\.año\}`/g, 'a.mes + " " + a.año');
content = content.replace(/`\$\{b\.mes\} \$\{b\.año\}`/g, 'b.mes + " " + b.año');

// Fix parsePeriodoFrom calls that might have wrong syntax
content = content.replace(/this\.parsePeriodoFrom\((.*?)\.mes,\s*(.*?)\.año\)/g, 'this.parsePeriodoFrom($1.mes, $1.año)');

fs.writeFileSync(invoiceTablePath, content, 'utf8');

// Fix dashboard.service.ts
const dashboardPath = 'src/app/services/dashboard.service.ts';
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

// Replace remaining parsePeriodo calls
dashContent = dashContent.replace(/this\.parsePeriodo\(`\$\{inv\.mes\} \$\{inv\.año\}`\)/g, 'this.parsePeriodoFrom(inv.mes, inv.año)');
dashContent = dashContent.replace(/this\.parsePeriodo\(`\$\{inv\.mes\} \$\{inv\.año\}`\)/g, 'this.parsePeriodoFrom(inv.mes, inv.año)');

// Fix any remaining references
dashContent = dashContent.replace(/`\$\{inv\.mes\} \$\{inv\.año\}`/g, 'inv.mes + " " + inv.año');

fs.writeFileSync(dashboardPath, content, 'utf8');

console.log('✅ Fixed template strings in TypeScript files');
