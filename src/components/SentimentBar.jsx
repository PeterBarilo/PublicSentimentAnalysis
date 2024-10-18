import React from 'react';
import './SentimentBar.css'; // Import the CSS file

const SentimentBar = ({ sentiments }) => {
  // Count the number of each sentiment type
  const sentimentCounts = sentiments.reduce((acc, sentiment) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  // Total number of sentiments
  const totalSentiments = sentiments.length;

  // Calculate the percentage width for each sentiment type
  const positiveWidth = ((sentimentCounts.POSITIVE || 0) / totalSentiments) * 100;
  const negativeWidth = ((sentimentCounts.NEGATIVE || 0) / totalSentiments) * 100;
  const neutralWidth = ((sentimentCounts.NEUTRAL || 0) / totalSentiments) * 100;

  return (
    <div className="sentiment-bar-container">
      <div
        className="sentiment-bar positive"
        style={{ width: `${positiveWidth}%` }}
        title={`Positive: ${sentimentCounts.POSITIVE || 0}`}
      >
        {positiveWidth > 10 && <span className="sentiment-label">Positive</span>}
      </div>
      <div
        className="sentiment-bar neutral"
        style={{ width: `${neutralWidth}%` }}
        title={`Neutral: ${sentimentCounts.NEUTRAL || 0}`}
      >
        {neutralWidth > 10 && <span className="sentiment-label">Neutral</span>}
      </div>
      <div
        className="sentiment-bar negative"
        style={{ width: `${negativeWidth}%` }}
        title={`Negative: ${sentimentCounts.NEGATIVE || 0}`}
      >
        {negativeWidth > 10 && <span className="sentiment-label">Negative</span>}
      </div>
    </div>
  );
};

export default SentimentBar;
