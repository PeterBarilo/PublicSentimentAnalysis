import os
import subprocess
import pandas as pd
from flask import Flask, request, jsonify
from itertools import cycle
import random

app = Flask(__name__)

# Define the path to the scraper script
SCRAPER_PATH = os.path.join(os.getcwd(), 'selenium-twitter-scraper', 'scraper', '__main__.py')
TWEETS_DIR = os.path.join(os.getcwd(), 'tweets')

# Proxy pool (replace these with valid proxies)
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

@app.route('/scrape', methods=['POST'])
def scrape_tweets():
    try:
        # Get the keyword and tweet count from the request
        data = request.get_json()
        keyword = data.get('keyword')
        tweet_count = data.get('tweet_count', 10)  # Default to 10 tweets if not provided

        # Get the next proxy from the pool
        proxy = next(proxy_pool)
        print(f"Using proxy: {proxy}")

        # Construct the command to run the scraper with the rotating proxy
        command = [
            'python', SCRAPER_PATH,
            '-t', str(tweet_count),
            '-q', keyword,
            '--top',
            '-p', proxy  # Add the proxy argument here
        ]

        # Run the command using subprocess
        subprocess.run(command, check=True)

        # Find the most recent CSV file in the tweets directory
        csv_files = [f for f in os.listdir(TWEETS_DIR) if f.endswith('.csv')]
        if not csv_files:
            return jsonify({'success': False, 'message': 'No data found'}), 404

        # Get the latest CSV file based on modification time
        latest_csv_file = max([os.path.join(TWEETS_DIR, f) for f in csv_files], key=os.path.getmtime)
        print(f"Latest CSV file found: {latest_csv_file}")

        # Read the CSV content and convert it to a DataFrame
        df = pd.read_csv(latest_csv_file)

        # Convert the DataFrame to a list of dictionaries (JSON format)
        tweet_data = df.to_dict(orient='records')

        # Return the data as JSON
        return jsonify({'success': True, 'data': tweet_data}), 200

    except subprocess.CalledProcessError as e:
        # Capture and display error details
        return jsonify({'success': False, 'message': str(e), 'stderr': e.stderr}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
