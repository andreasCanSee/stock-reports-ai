let reportCache = {};

const getCurrentDate = () => new Date().toDateString();

const addReportToCache = (ticker, days, reportData) => {
    const currentDate = getCurrentDate();
    if (!reportCache[currentDate]) {
        reportCache[currentDate] = {};
    }
    if (!reportCache[currentDate][ticker]) {
        reportCache[currentDate][ticker] = {};
    }
    reportCache[currentDate][ticker][days] = reportData;
    console.log(reportCache)
};

const getReportFromCache = (ticker, days) => {
    const currentDate = getCurrentDate();
    // return reportCache[currentDate] ? reportCache[currentDate][ticker] : undefined;
    return reportCache[currentDate] &&
           reportCache[currentDate][ticker] &&
           reportCache[currentDate][ticker][days];
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