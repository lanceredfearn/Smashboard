export function exportCSV(filename: string, rows: (string | number)[][]) {
    const csvContent = rows
        .map(row =>
            row
                .map(cell => {
                    const value = String(cell ?? '');
                    return /[",\n]/.test(value)
                        ? `"${value.replace(/"/g, '""')}"`
                        : value;
                })
                .join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=UTF-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}
