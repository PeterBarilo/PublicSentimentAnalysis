import React from 'react';
import './SentimentBar.css';

const SentimentBar = ({ sentiments }) => {
  const sentimentCounts = sentiments.reduce((acc, sentiment) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const totalSentiments = sentiments.length;

  const positiveWidth = ((sentimentCounts.POSITIVE || 0) / totalSentiments) * 100;
  const negativeWidth = ((sentimentCounts.NEGATIVE || 0) / totalSentiments) * 100;
  const neutralWidth = ((sentimentCounts.NEUTRAL || 0) + (sentimentCounts.MIXED || 0)) / totalSentiments * 100;

  const calculateMost = (positiveWidth, negativeWidth,neutralWidth) =>{
    if(positiveWidth > negativeWidth && positiveWidth > neutralWidth){
      if(positiveWidth >= 80){
        return 'Overwhelmingly Positive'
      }
      else if(positiveWidth > 50){
        return 'Majority Positive'
      }
      return 'Positive';
    }
    if(negativeWidth > positiveWidth && negativeWidth > neutralWidth){
      if(negativeWidth >= 80){
        return 'Overwhelmingly Negative'
      }
      else if(negativeWidth > 50){
        return 'Majority Negative'
      }
      return 'Negative';
    }
    if(neutralWidth > positiveWidth && neutralWidth > negativeWidth){
      if(neutralWidth >= 80){
        return 'Overwhelmingly Neutral'
      }
      else if(neutralWidth > 50){
        return 'Majority Neutral'
      }
      return 'Neutral';
    }
    if(neutralWidth === positiveWidth){
      return 'Slightly Positive'
    }
    if(neutralWidth === negativeWidth){
      return 'Slightly Negative'
    }
  }
  return (
    <>
    <div className="sentiment-bar-container">
      <div
        className="sentiment-bar positive"
        style={{ width: `${positiveWidth}%` }}
        title={`Positive: ${sentimentCounts.POSITIVE || 0}`}
      >
        {positiveWidth > 1 && <span className="sentiment-label">Positive</span>}
      </div>
      <div
        className="sentiment-bar neutral"
        style={{ width: `${neutralWidth}%` }}
        title={`Neutral: ${sentimentCounts.NEUTRAL || 0}`}
      >
        {neutralWidth > 1 && <span className="sentiment-label">Neutral</span>}
      </div>
      <div
        className="sentiment-bar negative"
        style={{ width: `${negativeWidth}%` }}
        title={`Negative: ${sentimentCounts.NEGATIVE || 0}`}
      >
        {negativeWidth > 1 && <span className="sentiment-label">Negative</span>}
      </div>
    </div>
    <h2 className='overall-result'>Result: {calculateMost(positiveWidth, negativeWidth, neutralWidth)}</h2>
    </>
    
  );
};

export default SentimentBar;
