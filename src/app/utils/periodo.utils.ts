// Helper to transform periodo string to mes+año
function getPeriodoDisplay(mes: string, anio: number): string {
    return `${mes} ${anio}`;
}

// Helper to parse periodo for date comparison - now takes mes and año separately
function parsePeriodoFromFields(mes: string, anio: number): Date {
    const monthMap: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    const monthIndex = monthMap[mes.toLowerCase()];
    if (monthIndex === undefined) {
        console.warn(`Invalid month: ${mes}`);
        return new Date();
    }

    return new Date(anio, monthIndex, 1);
}

// For sorting invoices by periodo
function comparePeriodos(invoice1: { mes: string, anio: number }, invoice2: { mes: string, anio: number }): number {
    const date1 = parsePeriodoFromFields(invoice1.mes, invoice1.anio);
    const date2 = parsePeriodoFromFields(invoice2.mes, invoice2.anio);
    return date1.getTime() - date2.getTime();
}

export { getPeriodoDisplay, parsePeriodoFromFields, comparePeriodos };
