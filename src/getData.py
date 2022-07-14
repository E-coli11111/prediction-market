import json
import sys
import requests


class DataLoader:
    def __init__(self, key, path, proxies={'http': "http://127.0.0.1:19180", 'https': "http://127.0.0.1:19180"}):
        self.key = key
        self.path = path
        self.proxies = proxies

    def getData(self, seriesIDs, startYear, endYear):
        headers = {'Content-type': 'application/json'}
        data = json.dumps(
            {"seriesid": seriesIDs, "startyear": str(startYear), "endyear": str(endYear), "registrationkey": self.key})
        res = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers,
                            proxies=self.proxies)
        return res

#
# if __name__ == '__main__':
#     loader = DataLoader("43a88943af9049d094c611a68830d2f0", "1.txt")
#     data = loader.getData("CUUR0000AA0", "2018", "2019")
#     print(data.text)

def getData(key, path, seriesIDs, startYear, endYear):
    loader = DataLoader(key, path)
    return loader.getData(seriesIDs, startYear, endYear)


def main():
    res = getData(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    print(json.dump(data))
    sys.stdout.flush()


res = getData(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
print(res.text)

