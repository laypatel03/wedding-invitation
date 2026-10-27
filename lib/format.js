// Formatting shared by the invitation (server) and the admin form (browser).
// No Node imports here, so client components can use it.

const TZ = 'Asia/Kolkata';
export const TZ_OFFSET = '+05:30';

export function at(date, time) {
    return new Date(`${date}T${time}:00${TZ_OFFSET}`);
}

// "17:00" -> "5:00 PM" (or "5 PM" with short)
export function formatTime(time, { short = false } = {}) {
    const [h, m] = time.split(':').map(Number);
    const hour = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return short && m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// "2027-01-29" -> { weekday: 'Friday', day: '29 January 2027' }
export function formatDate(date) {
    const d = at(date, '12:00');
    return {
        weekday: d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: TZ }),
        day: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }),
    };
}

// "919824856661" -> "+91 98248 56661", "12018569575" -> "+1 (201) 856-9575"
export function formatPhone(digits) {
    if (!digits) return '';
    if (digits.startsWith('91') && digits.length === 12) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    if (digits.startsWith('1') && digits.length === 11) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits}`;
}
