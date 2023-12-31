function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Check if a date is a weekend
function isWeekend(date){
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

function getDateNDaysAgo(days) {
    const now = new Date(); // current date and time
    let daysAgo = days;

    while (daysAgo > 0){
        now.setDate(now.getDate() - 1); // Move back one day
        if (!isWeekend(now)) {
            daysAgo--; // Only decrement if it's a business day
        }

    }
    return formatDate(now);
}

export function getReportDates(days) {
    return {
        startDate: getDateNDaysAgo(days), // Last n business days
        endDate: getDateNDaysAgo(1) // Yesterday, assuming it's not a weekend
    };
}

