import requests

def test_proxy(proxy):
    try:
        # Set up the proxies dictionary
        proxies = {
            "http": f"http://{proxy}",
            "https": f"http://{proxy}"
        }
        
        # Test with a simple request (Google or any public website)
        response = requests.get("http://www.google.com", proxies=proxies, timeout=5)
        
        # If status code is 200, the proxy is working
        if response.status_code == 200:
            print(f"Proxy {proxy} is working!")
        else:
            print(f"Proxy {proxy} returned status code: {response.status_code}")
    
    except requests.exceptions.ProxyError:
        print(f"Proxy {proxy} failed: ProxyError")
    except requests.exceptions.ConnectTimeout:
        print(f"Proxy {proxy} failed: Connection Timeout")
    except requests.exceptions.RequestException as e:
        print(f"Proxy {proxy} failed: {e}")

# Replace '123.45.67.89:8080' with the actual proxy you want to test
test_proxy('154.214.1.21:3128')
