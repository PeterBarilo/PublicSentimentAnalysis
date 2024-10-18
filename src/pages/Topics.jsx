import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SentimentBar from '../components/SentimentBar';
const Topics = () => {
  const [topics] = useState([
    'Donald Trump',
    'Kamala Harris',
  ]);

  const [sentimentData, setSentimentData] = useState({});
  const [loading, setLoading] = useState(false);

  const delay = ms => new Promise(res => setTimeout(res, ms));

const fetchSentimentResults = async (topic, retryCount = 0, maxRetries = 20) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/sentiment-results', {
      params: { file_name: `${topic.replace(" ", "_").toLowerCase()}.csv-sentiment.json` }
    });

    if (response.status === 200 && response.data.success) {
      const sentiment = response.data.sentiments; 
      console.log(sentiment)
      setSentimentData((prevData) => ({
        ...prevData,
        [topic]: sentiment
      }));

    } else {
      console.error(`Error fetching sentiment for ${topic}:`, response.data.message);
      if (retryCount < maxRetries) {
        console.log(`Retrying sentiment fetch for ${topic}... (attempt ${retryCount + 1})`);
        await delay(3000); 
        fetchSentimentResults(topic, retryCount + 1, maxRetries);  
      } else {
        console.error(`Max retries reached for ${topic}. Sentiment data could not be retrieved.`);
      }
    }
  } catch (error) {
    console.error(`Error fetching sentiment for ${topic}:`, error);
    if (retryCount < maxRetries) {
      console.log(`Retrying sentiment fetch for ${topic}... (attempt ${retryCount + 1})`);
      await delay(3000);  
      fetchSentimentResults(topic, retryCount + 1, maxRetries);  
    } else {
      console.error(`Max retries reached for ${topic}. Sentiment data could not be retrieved.`);
    }
  }
};


  const scrapeTweetsForTopic = async (topic) => {
    try {
      const response = await axios.post('/scrape', {
        keyword: topic,
        tweet_count: 10  
      });

      if (response.status === 200) {        
        fetchSentimentResults(topic);
      } else {
        console.error(`Failed to scrape tweets for ${topic}`);
      }
    } catch (error) {
      console.error(`Error scraping tweets for ${topic}:`, error);
    }
  };

  useEffect(() => {
    setLoading(true);
    topics.forEach(async (topic) => {
      await scrapeTweetsForTopic(topic);
    });
    setLoading(false);
  }, [topics]);

  return (
    <div>
    <h1>Hot Topics Sentiment Analysis</h1>
    {topics.map((topic) => (
      <div key={topic} style={{ marginBottom: '20px' }}>
        <h3>{topic}</h3>
        {sentimentData[topic] ? (
          <SentimentBar sentiments={sentimentData[topic]} />
        ) : (
          <p>Loading sentiment data...</p>
        )}
      </div>
    ))}
  </div>
  );
};

export default Topics;
