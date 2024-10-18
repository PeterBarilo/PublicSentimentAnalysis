#Code for lambda function in AWS

import boto3
import json
import csv
import os

s3 = boto3.client('s3')
comprehend = boto3.client('comprehend')

def lambda_handler(event, context):
    try:
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        object_key = event['Records'][0]['s3']['object']['key']
        
        topic_name = os.path.basename(object_key).replace('_tweets.csv', '')

        local_file_path = f'/tmp/{os.path.basename(object_key)}'
        s3.download_file(bucket_name, object_key, local_file_path)
        
        sentiments = []
        with open(local_file_path, mode='r', encoding='utf-8') as csvfile:
            csvreader = csv.DictReader(csvfile)
            for row in csvreader:
                text = row['Content']  
                sentiment_response = comprehend.detect_sentiment(
                    Text=text,
                    LanguageCode='en'
                )
                sentiments.append({
                    'Text': text,
                    'Sentiment': sentiment_response['Sentiment'],
                    'SentimentScore': sentiment_response['SentimentScore']
                })
        
        sentiment_results = {
            'file': object_key,
            'sentiments': sentiments
        }

        result_key = f"sentiment-results/{topic_name}-sentiment.json"
        s3.put_object(
            Bucket=bucket_name,
            Key=result_key,
            Body=json.dumps(sentiment_results),
            ContentType='application/json'
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps(f"Sentiment analysis results stored at {result_key}")
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error: {str(e)}"
        }
