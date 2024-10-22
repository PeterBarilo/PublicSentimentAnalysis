# **Public Sentiment Insights** 🎯

Link to Demo Site: https://d1617fu4h6pogp.cloudfront.net/

This is a machine learning-powered web application that provides sentiment analysis on hot debate topics gathered from online sources. It also allows users to enter a custom keyword or phrase to perform sentiment analysis on.

The current source for public data is X(Twitter)



## **Key Features** ✨
- **On_Demand Sentiment Analysis**: Analyze public opinions on trending debate topics.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Engaging Visuals**: Dynamic charts, hover effects, and easy to digest data for a rich user experience.

---

## **Technologies Used** 🛠️
- **Frontend**: 
  - React 
  - CSS
- **Backend**: 
  - Flask (routing)
  - Python (Selenium Script)
  - AWS Comprehend (accurate sentiment analysis)
  - AWS Lambda (S3 trigger and data processing)
  - AWS S3 (frontend hosting, tweet and sentiment data storage)
  - AWS CloudFront CDN (SSL and content delivery)
  - CloudFlared Tunnel: Backend is currently hosted on home server, free-tier t2.micro instance doesn't have enough RAM, dont want to pay for larger instances :)
---

## **Next Steps** 
- Implement on demand keyword search
- Increase accuracy by feeding more Data(tweets)
- Provide more in depth analysis besides +/- sentiment
- Add more graphics and charts to better visualize data
- Enable discussion by adding chatrooms under current topics

## **Installation** 🛠️

To run this app locally, follow the instructions below:
(Code only, need to set up AWS account and services yourself, however Lambda code is provided in backend folder)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/debate-insights.git
   cd debate-insights
   npm install
   npm run dev

