let reportCache = {};

const getCurrentDate = () => new Date().toDateString();

const addReportToCache = (ticker, reportData) => {
    const currentDate = getCurrentDate();
    if (!reportCache[currentDate]) {
        reportCache[currentDate] = {};
    }
    reportCache[currentDate][ticker] = reportData;
};

const getReportFromCache = (ticker) => {
    const currentDate = getCurrentDate();
    return reportCache[currentDate] ? reportCache[currentDate][ticker] : undefined;
};

const clearOldCacheEntries = () => {
    const currentDate = getCurrentDate();
    Object.keys(reportCache).forEach(date => {
        if (date !== currentDate) {
            delete reportCache[date];
        }
    });
};

export { addReportToCache, getReportFromCache, clearOldCacheEntries };