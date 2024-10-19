import React from 'react';
import SentimentBar from './SentimentBar';
import { useNavigate } from 'react-router-dom'; 
import './SentimentCard.css'
import LoadingSpinner from './LoadingSpinner'; 


const SentimentCard = ({ topic, overallSentiment, loading, topicMapping}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/topic/${topic}`, { state: { subtopics: topicMapping[topic] } });
  };

  return (
    <div className="sentiment-card" onClick={handleCardClick}>
      <h2 className='topic'>{topic}</h2>
      <h3>Overall Sentiment</h3>
      {loading === true ? <LoadingSpinner></LoadingSpinner> : <SentimentBar sentiments={overallSentiment} />}
      
    </div>
  );
};

export default SentimentCard;
