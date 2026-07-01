import urllib.request
import json
import ssl

def main():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    # Login
    login_req = urllib.request.Request(
        'http://localhost:3000/api/auth/login',
        data=json.dumps({"email": "demo@store.com", "password": "demo123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        login_res = urllib.request.urlopen(login_req, context=ctx)
        login_data = json.loads(login_res.read().decode('utf-8'))
        token = login_data['token']
        print("Got token")
    except Exception as e:
        print("Login error:", e)
        return

    # Get products
    prod_req = urllib.request.Request(
        'http://localhost:3000/api/products',
        headers={'Authorization': f'Bearer {token}'}
    )
    try:
        prod_res = urllib.request.urlopen(prod_req, context=ctx)
        prod_data = json.loads(prod_res.read().decode('utf-8'))
        product = prod_data['data'][0]
        print("Got product", product['_id'])
    except Exception as e:
        print("Products error:", e)
        return

    # Create Bill
    bill_req = urllib.request.Request(
        'http://localhost:3000/api/bills',
        data=json.dumps({"items": [{"product": product['_id'], "qty": 1}], "discount": 0}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    try:
        bill_res = urllib.request.urlopen(bill_req, context=ctx)
        bill_data = json.loads(bill_res.read().decode('utf-8'))
        print("Bill created:", bill_data)
    except urllib.error.HTTPError as e:
        print("Bill error:", e.code)
        print(e.read().decode('utf-8'))
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
