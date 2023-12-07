import express from "express";
import { fetchOpenAIResponse } from '../api/openai/openaiHelper.js'
import { getCompanyInfoMessages, getCompanyLinksInfoMessages } from '../api/openai/openaiMessages.js'
import {  saveCompanyInfoToCache, getCompanyInfoFromCache } from '../api/cacheManager.js'

const router = express.Router();

router.get('/info', async (req, res) => {
    const { q: companyName } = req.query;

    if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    try {
      
      const cachedData = getCompanyInfoFromCache(companyName);
      if (cachedData) {
        return res.json({ status: "success", data: {
          companyName: companyName,
          description: cachedData
        } });
      }
      
      const companyInfoMessages = getCompanyInfoMessages(companyName);
      const companyInfoResponse = await fetchOpenAIResponse(companyInfoMessages);
      
      saveCompanyInfoToCache(companyName, companyInfoResponse);
      
      res.json({ 
        status: "success",
        data: {
            companyName: companyName,
            description: companyInfoResponse
          }
        });
    } catch (err) {
        console.error('Error fetching company info:', err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }

})

const parseLinksResponse = (responseText) => {
    const bulletPoints = responseText.split('\n');
    return bulletPoints.map(point => {
        const [description, link] = point.split(': ').map(part => part.trim());
        const cleanedDescription = description.replace('- ', '');
        return { description: cleanedDescription, link };
    });
  };
  
router.get('/links', async (req, res) => {
    const { q: companyName } = req.query;
  
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }
  
    try {
      const companyLinksMessages = getCompanyLinksInfoMessages(companyName);
      const linksInfoResponse = await fetchOpenAIResponse(companyLinksMessages);
      const parsedLinks = parseLinksResponse(linksInfoResponse);
      res.json({ 
        status: "success",
        data: {
          companyName: companyName,
          links: parsedLinks
        }
      });
    } catch (err) {
      console.error('Error fetching company links:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

export default router;