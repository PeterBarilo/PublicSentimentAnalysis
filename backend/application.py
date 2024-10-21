import os
import subprocess
import pandas as pd
from flask import Flask, request, jsonify
from itertools import cycle
import random
import boto3
from botocore.exceptions import NoCredentialsError
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS


application = Flask(__name__)
CORS(application, supports_credentials=True)

SCRAPER_PATH = os.path.join(os.getcwd(), 'selenium-twitter-scraper', 'scraper', '__main__.py')
TWEETS_DIR = os.path.join(os.getcwd(), 'tweets')


load_dotenv()

proxies = [
    '156.228.88.80:3128',
    '154.214.1.21:3128',
    '104.207.53.89:3128	',
    '156.228.88.175:3128',
    '156.228.90.176:3128',
    '156.253.165.24:3128',
    '104.207.39.109:3128',
    '156.233.92.140:3128',
    '45.202.77.180:3128',
    '104.207.54.69:3128',
    '104.167.26.17:3128',
    '154.213.198.255:3128',
    '156.249.137.219:3128',
    '156.228.171.163:3128',
    '156.228.108.79:3128',
    '154.213.198.48:3128',
    '156.253.166.49:3128',
    '45.201.10.8:3128',
    '156.228.108.151:3128',
    '156.228.181.134:3128',
    '156.228.118.200:3128',
    '154.213.202.81:3128',
    '154.213.195.112:3128',
    '156.228.98.224:3128',
    '156.228.107.92:3128',
    '156.228.107.212:3128',
    '156.228.97.135:3128',
    '104.207.36.63:3128',
    '104.167.27.96:3128',
    '154.213.197.225:3128',
    '156.228.99.166:3128',
    '104.207.43.197:3128',
    '154.213.203.200:3128',
    '156.228.100.120:3128',
    '156.233.95.137:3128',
    '154.213.194.48:3128',
    '156.233.86.145:3128',
    '104.207.63.48:3128',
    '104.207.41.106:3128',
    '156.233.90.195:3128',
    '104.207.57.195:3128',
    '104.207.49.143:3128',
    '154.91.171.144:3128',
    '104.207.34.106:3128',
    '156.253.171.46:3128',
    '156.233.94.164:3128',
    '104.167.24.152:3128',
    '154.94.12.82:3128',
    '154.94.12.198:3128',
    '104.207.52.164:3128',
    '154.94.13.2:3128',
    '156.228.104.126:3128',
    '156.228.92.166:3128',
    '156.228.116.175:3128',
    '104.207.51.153:3128',
    '156.228.178.210:3128',
    '104.167.30.161:3128',
    '104.207.62.90:3128',
    '104.207.38.239:3128',
    '156.228.77.163:3128',
    '156.228.102.50:3128',
    '104.207.37.80:3128',
    '156.228.96.204:3128',
    '156.228.102.16:3128',
    '156.233.93.109:3128',
    '104.207.53.175:3128',
    '156.228.180.191:3128',
    '156.249.137.33:3128',
    '156.228.110.104:3128',
    '156.249.137.56:3128',
    '156.233.91.62:3128',
    '156.233.75.141:3128',
    '156.253.166.214:3128',
    '156.228.96.43:3128',
    '156.228.182.42:3128',
    '156.228.119.241:3128',
    '104.167.31.215:3128',
    '104.207.50.153:3128',
    '104.207.62.16:3128',
    '104.207.43.105:3128',
    '156.228.185.192:3128',
    '156.233.75.5:3128',
    '154.213.194.206:3128',
    '104.207.48.18:3128',
    '156.228.82.87:3128',
    '104.207.57.168:3128',
    '156.228.101.224:3128',
    '156.253.165.124:3128',
    '154.213.202.144:3128',
    '156.228.181.154:3128',
    '104.207.38.2:3128',
    '156.228.176.225:3128',
    '104.167.24.97:3128',
    '156.228.97.163:3128',
    '156.253.172.12:3128',
    '45.201.10.2:3128',
    '156.228.110.194:3128',
    '156.233.89.51:3128',
    '104.207.33.228:3128',
    '156.228.104.150:3128'
]

random.shuffle(proxies)
proxy_pool = cycle(proxies)

session = boto3.Session(
    aws_access_key_id=os.getenv("AWS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET"),
    region_name='us-east-2' 
)

s3 = session.resource('s3')

@application.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


@application.route('/scrape', methods=['POST'])
def scrape_tweets():
    if request.method == 'OPTIONS':
        # Preflight request, return necessary headers
        response = jsonify({'message': 'CORS preflight successful'})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 200
    try:
        data = request.get_json()
        keyword = data.get('keyword')
        tweet_count = data.get('tweet_count', 10) 

          # Construct the S3 key for the sentiment result file
        sentiment_file_key = f'sentiment-results/{keyword.replace(" ", "_").lower()}.csv-sentiment.json'

        # Check if the sentiment file already exists in S3
        try:
            s3_client.head_object(Bucket='scraped-tweets-bucket312212', Key=sentiment_file_key)
            print(f"Sentiment file already exists for {keyword}. No need to scrape.")
            return jsonify({'success': True, 'message': 'Sentiment file already exists.'}), 200
        except s3_client.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"Sentiment file not found for {keyword}. Proceeding with scraping.")
            else:
                return jsonify({'success': False, 'message': 'Error checking sentiment file in S3.'}), 500

        proxy = next(proxy_pool)
        print(f"Using proxy: {proxy}")

        command = [
            'python', SCRAPER_PATH,
            '-t', str(tweet_count),
            '-q', keyword,
            '--top',
            '-p', proxy 
        ]

        subprocess.run(command, check=True)

        csv_file_path = os.path.join(TWEETS_DIR, f'{keyword.replace(" ", "_").lower()}.csv')
        if not os.path.exists(csv_file_path):
            return jsonify({'success': False, 'message': f'No CSV file found for keyword: {keyword}'}), 404

        print(f"CSV file found: {csv_file_path}")
        s3_file_key = f'tweets/{os.path.basename(csv_file_path)}'
        upload_success = upload_file_to_s3(csv_file_path, 'scraped-tweets-bucket312212', s3_file_key, session)

        if not upload_success:
            return jsonify({'success': False, 'message': 'Failed to upload to S3'}), 500

        df = pd.read_csv(csv_file_path)
        tweet_data = df.to_dict(orient='records')

        return jsonify({'success': True, 'data': tweet_data}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({'success': False, 'message': str(e), 'stderr': e.stderr}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


aws_access_key = os.getenv("AWS_KEY")
aws_secret_key = os.getenv("AWS_SECRET")

s3_client = boto3.client(
    's3',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name="us-east-2"
)

@application.route('/sentiment-results', methods=['GET'])
def get_sentiment_results():
    keyword = request.args.get('file_name')

    if not keyword:
        return jsonify({'success': False, 'message': 'file_name parameter (keyword) is required'}), 400

    try:
        response = s3_client.list_objects_v2(Bucket='scraped-tweets-bucket312212', Prefix='sentiment-results/')
        
        if 'Contents' not in response:
            return jsonify({'success': False, 'message': 'No sentiment results found in S3'}), 404
        
        matching_files = [obj['Key'] for obj in response['Contents'] if keyword in obj['Key']]
        
        if not matching_files:
            return jsonify({'success': False, 'message': f'No sentiment file found for keyword: {keyword}'}), 404
        
        latest_file_key = max(matching_files, key=lambda x: x.split('/')[-1])

        response = s3_client.get_object(Bucket='scraped-tweets-bucket312212', Key=latest_file_key)
        sentiment_data = json.loads(response['Body'].read())
        sentiments = [item['Sentiment'] for item in sentiment_data['sentiments']]

        return jsonify({'success': True, 'sentiments': sentiments}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error retrieving sentiment results: {e}'}), 500


@application.route('/health', methods=['GET'])
def health_check():
    return 'OK', 200

def upload_file_to_s3(file_path, bucket_name, s3_file_key, session):
    s3_client = session.client('s3')
    
    try:
        s3_client.upload_file(file_path, bucket_name, s3_file_key)
        print(f"File uploaded to S3: {s3_file_key}")
        return True
    except Exception as e:
        print(f"Error uploading file to S3: {e}")
        return False

if __name__ == '__main__':
    application.run(debug=True) # Ensure this runs on all IPs
