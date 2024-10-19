import requests

def test_proxy(proxy):
    try:
        proxies = {
            "http": f"http://{proxy}",
            "https": f"http://{proxy}"
        }
        
        response = requests.get("http://www.google.com", proxies=proxies, timeout=5)
        
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

test_proxy('154.214.1.21:3128')
