import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SentimentBar from '../components/SentimentBar';
import axios from 'axios';
import './TopicPage.css'
import LoadingSpinner from '../components/LoadingSpinner'; 

const TopicPage = () => {
  const { topic } = useParams(); // Get the topic from the URL
  const location = useLocation();
  const { subtopics } = location.state || { subtopics: [] };
  const [subtopicSentiments, setSubtopicSentiments] = useState({});
  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchSentimentResults = async (subtopic, retryCount = 0, maxRetries = 20) => {
    try {
      const response = await axios.get('http://psa-backend4.us-east-2.elasticbeanstalk.com/sentiment-results', {
        params: { file_name: `${subtopic.replace(" ", "_").toLowerCase()}.csv-sentiment.json` }
      });

      if (response.status === 200 && response.data.success) {
        const sentiment = response.data.sentiments;
        setSubtopicSentiments((prevData) => ({
          ...prevData,
          [subtopic]: sentiment
        }));
      } else {
        console.error(`Error fetching sentiment for ${subtopic}:`, response.data.message);
        if (retryCount < maxRetries) {
          console.log(`Retrying sentiment fetch for ${subtopic}... (attempt ${retryCount + 1})`);
          await delay(3000);
          fetchSentimentResults(subtopic, retryCount + 1, maxRetries);
        } else {
          console.error(`Max retries reached for ${subtopic}. Sentiment data could not be retrieved.`);
        }
      }
    } catch (error) {
      console.error(`Error fetching sentiment for ${subtopic}:`, error);
      if (retryCount < maxRetries) {
        console.log(`Retrying sentiment fetch for ${subtopic}... (attempt ${retryCount + 1})`);
        await delay(3000);
        fetchSentimentResults(subtopic, retryCount + 1, maxRetries);
      } else {
        console.error(`Max retries reached for ${subtopic}. Sentiment data could not be retrieved.`);
      }
    }
  };

  const scrapeTweetsForSubtopic = async (subtopic) => {
    try {
      const response = await axios.post(
        'http://psa-backend4.us-east-2.elasticbeanstalk.com/scrape', 
        {
          keyword: subtopic,
          tweet_count: 5
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        fetchSentimentResults(subtopic);
      } else {
        console.error(`Failed to scrape tweets for ${subtopic}`);
      }
    } catch (error) {
      console.error(`Error scraping tweets for ${subtopic}:`, error);
    }
  };

  useEffect(() => {
    setLoading(true);
    subtopics.forEach(async (subtopic) => {
      if (!subtopicSentiments[subtopic]) {
        await scrapeTweetsForSubtopic(subtopic);
      }
    });
    setLoading(false);
  }, [subtopics, subtopicSentiments]);

  return (
    <div className='topicpage'>
      <h1>Explore Topics Related to <em>{topic}</em></h1> {/* Display the topic name */}
      <hr />
      {subtopics.map((subtopic) => (
        <div className='subtopic-container' key={subtopic}>
          <h2 className='subtopic-title'>{subtopic}</h2>
          {subtopicSentiments[subtopic] ? (
            <SentimentBar sentiments={subtopicSentiments[subtopic]} />
          ) : (
            <LoadingSpinner />
          )}
        </div>
      ))}
    </div>
  );
};

export default TopicPage;
