#!/usr/bin/env python3
import glob
import json
import time
import requests
from multiprocessing import Pool
import asyncio
from pyppeteer import launch


defaultLimit = 300
collectionsUrl = 'https://api.opensea.io/api/v1/collections'
headers = {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
    "Referer": "https://opensea.io/",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
  }

def fetchCollections(offset, limit):
    url = f"{collectionsUrl}?offset={offset}&limit={limit}"
    collections = requests.get(url, headers=headers).json()
    if 'collections' in collections.keys():
        with open(f'collection_{offset}', 'w') as f:
            f.write(json.dumps(collections['collections'], indent=4))
        
        return collections['collections']

def fetchAllCollections():
    print("why not working")
    offset = 49800
    collections = []
    while True:
        print(f'Fetching from offset: {offset}')
        collection = fetchCollections(offset, defaultLimit)

        if not collection or not len(collection):
            break

        collections.append(collection)

        offset+=defaultLimit
        
    with open('collections.json', 'w') as f:
        f.write(json.dumps(collections))

def fetchCollectionInDetail(slug):
    url = f"https://api.opensea.io/api/v1/collection/{slug}"
    req = requests.get(url, headers=headers).json()
    print(json.dumps(req, indent=4))


def fetchAssetsFromCollection(slug, next=None):
    url = f"https://api.opensea.io/api/v1/assets?limit=50&include_orders=true&collection_slug={slug}"
    if next:
        url = f"{url}&cursor={next}"
    
    resp = requests.get(url, headers=headers).json()
    next = None
    assets = []

    if "next" in resp.keys():
        next = resp["next"]

    if "assets" in resp.keys():
        assets = resp["assets"]

    # time.sleep(1)
    print(resp)
    return next, assets

# def fetchAllAssetsFromCollection(slug, name):
def fetchAllAssetsFromCollection(collection):
    slug = collection["slug"]
    name = collection["name"]
    count = int(collection['stats']['count'])
    print(f'Total assets in {name} : {count}')
    # assets = []
    # next = None
    # if "Untitled Collection" in name:
    #     return 

    # while True:
    #     next, _assets = fetchAssetsFromCollection(slug, next)
    #     assets.append(_assets)
    #     if not next:
    #         break

    # if assets:
    #     with open(f'assets/{slug}-assets.json','w') as f:
    #         f.write(json.dumps(assets, indent=4))

async def createRooms():
    print("we are here")
    files = glob.iglob("collections/collection_*")
    browser = await launch()
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36')

    for file in files:
        with open(file) as f:
            collections = json.loads(f.read())
        
        for collection in collections:
            if not "Untitled Collection" in collection["name"] and collection['stats']['total_supply']:
                # fetchAllAssetsFromCollection(collection)
                # fetchAllAssetsFromCollection("pig-defi-club","pig")
                # fetchAllAssetsFromCollection("boredapeyachtclub")
        #         # fetchCollectionInDetail("boredapeyachtclub")
                try:
                    await fetchCollectionOpenSeaHome(page, collection['slug'])
                except:
                    pass
        #         break
        # break
    
        # Parallel(n_jobs=4)(delayed(fetchAllAssetsFromCollection)(collection['slug'], collection['name']) for collection in collections)
        # p = Pool()
        # p.map(fetchAllAssetsFromCollection, collections)

async def fetchCollectionOpenSeaHome(page, slug):
    url = f"https://opensea.io/collection/{slug}"

    await page.goto(url, {'waitUntil' : 'networkidle0'})

    data = await page.evaluate('''() => {
        return document.getElementById('__NEXT_DATA__').textContent
    }''')
    
    data = json.loads(data)
    data = data['props']['relayCache'][0][1]
    print(slug)
    print(data['json']['data']['assets']['search']['edges'][0]['node']['asset']['assetContract']['address'])


if __name__ == '__main__':
    fetchAllCollections()
    # createRooms()
    # asyncio.get_event_loop().run_until_complete(createRooms())
    # with open('op','r') as f:
    #     data = json.loads(f.read())
    
    # for i in data['props']['relayCache'][0]:
    #     print(json.dumps(i, indent=4))

    # data = data['props']['relayCache'][0][1]
    # print(data['json']['data']['assets']['search']['edges'][0]['node']['asset']['assetContract']['address'])
    

# fetchAllAssetsFromCollection('12-hamsters','uo') {
#     'isEditable': False, 
#     'bannerImageUrl': None, 
#     'name': 'Untitled Collection #269779583', 
#     'description': None, 
#     'imageUrl': None, 
#     'relayId': 'Q29sbGVjdGlvblR5cGU6ODI1MDI5OQ==', 
#     'connectedTwitterUsername': None, 
#     'representativeAsset': 
#         {
#             'assetContract': 
#             {
#                 'openseaVersion': '2.1.0', 
#                 'id': 'QXNzZXRDb250cmFjdFR5cGU6MzAxNjQ4'
#             }, 
#             'id': 'QXNzZXRUeXBlOjMyODcxMzMyOQ=='
#     }, 
#     'slug': 'untitled-collection-269779583', 
#     'isMintable': False, 
#     'isSafelisted': False, 
#     'isVerified': False, 
#     'owner': {
#         'address': '0x5d593796f15f0bc0669c9452ff1a97e2352d6ee6', 
#         'config': None, 
#         'isCompromised': False, 
#         'user': {
#             'publicUsername': None, 
#             'id': 'VXNlclR5cGU6Mjc0MzcxMjQ='
#             },
#         'displayName': None, 
#         'imageUrl': 'https://storage.googleapis.com/opensea-static/opensea-profile/15.png', 
#         'id': 'QWNjb3VudFR5cGU6MjY5Nzc5NTgz'
#     }, 
#     'stats': {
#         'numOwners': 1, 
#         'totalSupply': 1, 
#         'id': 'Q29sbGVjdGlvblN0YXRzVHlwZTo4MjUwMjk5'
#     }, 
#     'nativePaymentAsset': {
#         'symbol': 'ETH', 
#         'asset': {
#             'imageUrl': 'https://storage.opensea.io/files/265128aa51521c90f7905e5a43dcb456_new.svg', 
#             'id': 'QXNzZXRUeXBlOjE3OTgwNjkx'
#         }, 
#         'id': 'UGF5bWVudEFzc2V0VHlwZTo0NTk='
#     }, 
#     'statsV2': {
#         'numOwners': 1, 
#         'totalSupply': 1, 
#         'totalVolume': {
#             'unit': '0.000'
#             }, 
#             'floorPrice': None
#     }, 
#         'discordUrl': None, 
#         'externalUrl': None, 
#         'instagramUsername': None, 
#         'mediumUsername': None, 
#         'telegramUrl': None, 
#         'twitterUsername': None, 
#         'isWatching': False, 
#         'id': 'Q29sbGVjdGlvblR5cGU6ODI1MDI5OQ=='
# }