import fs from 'fs';
import path from 'path';

const appDirectory = process.cwd();

const cacheDir = path.join(appDirectory, 'data');
const companyInfoCacheFile = path.join(cacheDir, 'companyInfoCache.json');

let reportCache = {};
let companyInfoCache = {};

if (fs.existsSync(companyInfoCacheFile)) {
    companyInfoCache = JSON.parse(fs.readFileSync(companyInfoCacheFile, 'utf-8'));
}

const saveCompanyInfoToCache = (companyName, companyInfo) => {
    companyInfoCache[companyName] = companyInfo;
    fs.writeFileSync(companyInfoCacheFile, JSON.stringify(companyInfoCache));
};

const getCompanyInfoFromCache = (companyName) => {
    return companyInfoCache[companyName];
};

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
};

const getReportFromCache = (ticker, days) => {
    const currentDate = getCurrentDate();
    return reportCache[currentDate] &&
           reportCache[currentDate][ticker] &&
           reportCache[currentDate][ticker][days];
};

const clearOldReportCacheEntries = () => {
    const currentDate = getCurrentDate();
    Object.keys(reportCache).forEach(date => {
        if (date !== currentDate) {
            delete reportCache[date];
        }
    });
};

export {    
    saveCompanyInfoToCache, 
    getCompanyInfoFromCache, 
    addReportToCache, 
    getReportFromCache, 
    clearOldReportCacheEntries 
};