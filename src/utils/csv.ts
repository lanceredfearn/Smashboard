export function exportCSV(filename: string, rows: (string | number)[][]) {
    const csv = rows
        .map(r =>
            r.map(cell => {
                const s = String(cell ?? '');
                return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
            }).join(',')
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=UTF-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
