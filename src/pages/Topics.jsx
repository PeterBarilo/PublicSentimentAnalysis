import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SentimentCard from '../components/SentimentCard';
import './Topics.css';

const Topics = () => {
  const [topics] = useState([
    { name: 'Gaza Conflict', category: 'Politics' },
    { name: 'Ukraine Conflict', category: 'Politics' },
    { name: 'Jeff Bezos', category: 'Public Figures' },
    { name: 'Elon Musk', category: 'Public Figures' },
    { name: 'Election 2024', category: 'Politics' },
    { name: 'Super Bowl 2024', category: 'Sports' },
    { name: 'Olympics 2024', category: 'Sports' },
    { name: 'Climate Change', category: 'Trending' },
    { name: 'Artificial Intelligence', category: 'Technology' },
    { name: 'Cryptocurrency', category: 'Technology' },
  ]);
  
  const [categories] = useState([
    'All',
    'Politics',
    'Public Figures',
    'Trending',
    'Sports',
    'Technology',
  ]);
  
  const topicMapping = {
    'Election 2024': ['Donald Trump', 'Kamala Harris', 'Abortion'],
    'Gaza Conflict': ['Hamas', 'Israel'],
    'Ukraine Conflict': ['Russia', 'NATO', 'Crimea'],
    'Jeff Bezos': ['Amazon', 'Blue Origin', 'Philanthropy'],
    'Elon Musk': ['Tesla', 'SpaceX', 'Neuralink'],
    'Super Bowl 2024': ['NFL', 'Kansas City Chiefs', 'Philadelphia Eagles'],
    'Olympics 2024': ['Paris 2024', 'Track and Field', 'Gymnastics'],
    'Climate Change': ['Global Warming', 'Renewable Energy', 'Carbon Emissions'],
    'Artificial Intelligence': ['Machine Learning', 'Deep Learning', 'AI Ethics'],
    'Cryptocurrency': ['Bitcoin', 'Ethereum', 'Blockchain Technology'],
  };

  const [sentimentData, setSentimentData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [fetchedTopics, setFetchedTopics] = useState([]); // Track fetched topics


  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchSentimentResults = async (topic, retryCount = 0, maxRetries = 20) => {
    try {
      const response = await axios.get('https://initial-helps-mx-persistent.trycloudflare.com/sentiment-results', {
        params: { file_name: `${topic.replace(" ", "_").toLowerCase()}.csv-sentiment.json` }
      });

      if (response.status === 200) {
        const sentiment = response.data.sentiments;
        console.log(response.data)
        setSentimentData((prevData) => ({
          ...prevData,
          [topic]: sentiment
        }));
      } else {
        if (retryCount < maxRetries) {
          await delay(3000);
          fetchSentimentResults(topic, retryCount + 1, maxRetries);
        }
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        await delay(3000);
        fetchSentimentResults(topic, retryCount + 1, maxRetries);
      }
    }
  };

  const scrapeTweetsForTopic = async (topic) => {
    if (!fetchedTopics.includes(topic)) {
      try {
        const response = await axios.post(
          'https://initial-helps-mx-persistent.trycloudflare.com/scrape', 
          {
            keyword: topic,
            tweet_count: 5
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          fetchSentimentResults(topic);
          setFetchedTopics((prevFetched) => [...prevFetched, topic]); 
        }
      } catch (error) {
        console.error(`Error scraping tweets for ${topic}:`, error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const scrapeAndFetch = async () => {
      for (const topicObj of topics) {
        const topic = topicObj.name;
        if (!fetchedTopics.includes(topic)) {
          await scrapeTweetsForTopic(topic);
        }
      }
      setLoading(false);
    };
    scrapeAndFetch();
  }, [topics]);

  const filteredTopics = topics.filter(topic =>
    selectedCategory === 'All' || topic.category === selectedCategory
  );

  return (
    <div className='topics'>
      <h1 className='currentHot'>Current Hot Topics</h1>
      <hr />
      <h2 className='topics-sub'>Select one of the current Hot Topics below to see more related sentiment analysis</h2>


      <div className="topic-navbar">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className='cards-container'>
      {filteredTopics.map((topicObj) => (
        <div key={topicObj.name} className='sentimentCard'>
          {sentimentData[topicObj.name] ? (
            <SentimentCard topic={topicObj.name} overallSentiment={sentimentData[topicObj.name]} loading={false} topicMapping={topicMapping}/>
          ) : (
            <SentimentCard topic={topicObj.name} overallSentiment={sentimentData[topicObj.name]} loading={true}/>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default Topics;
