import requests
import json

# set up the request parameters
params = {
'api_key': 'C60D1B45EB5C4306963C40DA05C12D08',
  'search_type': 'scholar',
  'q': 'Perception of physical stability and center of mass of 3D objects',
  'include_html': 'true'
}

# make the http GET request to Scale SERP
api_result = requests.get('https://api.scaleserp.com/search', params)

# print the JSON response from Scale SERP
print(json.dumps(api_result.json()))

tmp = api_result.json()
author_text = tmp['scholar_results'][0]['displayed_link']
abstract = tmp['scholar_results'][0]['snippet']
total_result = 0 if 'total_results' not in tmp['search_information'].keys() else tmp['search_information']['total_results']
citation = tmp['scholar_results'][0]['cited_by_count']
cite_link = tmp['scholar_results'][0]['cited_by_link']
url = tmp['scholar_results'][0]['link']
domain = tmp['scholar_results'][0]['domain']
html = tmp['html']

import pdb; pdb.set_trace()