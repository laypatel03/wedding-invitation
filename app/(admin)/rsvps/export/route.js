import { readAllRsvps } from '@/lib/rsvp';

export const dynamic = 'force-dynamic';

const COLUMNS = ['at', 'name', 'phone', 'attending', 'guests', 'message'];

function csvCell(value) {
    const s = String(value ?? '');
    // Quote everything; also stop spreadsheet apps treating "=..." as a formula
    return '"' + (/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""') + '"';
}

// Every submission, including earlier answers a guest later changed
export async function GET() {
    const rows = (await readAllRsvps()).map(r => COLUMNS.map(c => csvCell(r[c])).join(','));
    const csv = '﻿' + [COLUMNS.join(','), ...rows].join('\r\n') + '\r\n'; // BOM so Excel reads UTF-8
    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="rsvps.csv"',
        },
    });
}
