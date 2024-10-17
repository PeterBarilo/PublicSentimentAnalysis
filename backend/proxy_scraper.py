import requests
from itertools import cycle
from concurrent.futures import ThreadPoolExecutor, as_completed

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

# Function to check if a proxy is valid
def is_valid_proxy(proxy):
    try:
        response = requests.get("http://www.google.com", proxies={"http": f"http://{proxy}", "https": f"http://{proxy}"}, timeout=1)  # Lower timeout
        return proxy if response.status_code == 200 else None
    except:
        return None


# Validate proxies in parallel
def validate_proxies(proxies):
    valid_proxies = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_proxy = {executor.submit(is_valid_proxy, proxy): proxy for proxy in proxies}
        for future in as_completed(future_to_proxy):
            proxy = future_to_proxy[future]
            try:
                result = future.result()
                if result:
                    valid_proxies.append(result)
                    print(f"Valid proxy found: {result}")
            except Exception as e:
                print(f"Error validating proxy {proxy}: {e}")
    return valid_proxies

# Get valid proxies
valid_proxies = validate_proxies(proxies)

# Check if there are valid proxies
if not valid_proxies:
    print("No valid proxies found. Exiting...")
    exit()

# Set up proxy pool
proxy_pool = cycle(valid_proxies)

def scrape_with_proxy(url):
    try:
        proxy = next(proxy_pool)
        proxies = {
            "http": f"http://{proxy}",
            "https": f"http://{proxy}",
        }

        response = requests.get(url, proxies=proxies, timeout=5)
        return response.text
    except requests.exceptions.ProxyError:
        print(f"ProxyError: Unable to connect to proxy {proxy}")
    except requests.exceptions.ConnectTimeout:
        print(f"TimeoutError: Connection timed out for proxy {proxy}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    
    return None

# Test the scraper
url = "https://api.twitter.com/2/tweets/search/recent"  # Example API endpoint
for _ in range(10):  # Try 10 different proxies
    result = scrape_with_proxy(url)
    if result:
        print(result)
        break  # If successful, break the loop
