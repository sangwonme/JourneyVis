from bs4 import BeautifulSoup
import requests
import re
import json
import pickle
import numpy as np
import pandas as pd
import os

class Paper:
    def __init__(self, paper_df):
        # from raw_data paper_df setup
        tmp = paper_df
        self.attr = ['author_list', 'abstract', 'venue', 'year', 'domain', 'url', 'citation', 'cite_url', 'html']
        for col in self.attr:
            tmp[col] = None
        
        # load cache
        self.cachepath ='./cache/paperdf.pkl'
        try:
            self.paper_df = pd.read_pickle(self.cachepath)
            print('load paper_df pickle.')
            # TODO : Augment data
            for idx, row in tmp.iterrows():
                title = row['title']
                print(title)
                if title not in self.paper_df['title'].values:
                    self.paper_df = self.paper_df._append(row)
                    print('appended')
        except:
            # add columns
            self.paper_df = tmp
        
        import pdb; pdb.set_trace()
            
        # update columns (metadata)
        self.update_all_metadata()

    @staticmethod
    def get_html(paper_title):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        # extract html
        paper_title = paper_title.replace(' ', '+')
        url = f'https://scholar.google.co.kr/scholar?q={paper_title}'
        response = requests.get(url, headers=headers)
        html = response.text
        return html
        
    @staticmethod
    def crawl_authors(paper_element):
        
        authors_text = paper_element.find('div', 'gs_a').text
        authors_text = authors_text.replace('…', '')
        authors_text = authors_text. replace(u'\xa0', u'')
        author_name_list = authors_text.split('-')[0].split(', ')
        # create author_list w/o url
        author_list = [{'name': n, 'url': ''} for n in author_name_list]
        # add url
        a_tags = paper_element.find('div', 'gs_a').find_all('a')
        for a_tag in a_tags:
            url = 'https://scholar.google.co.kr/'+a_tag['href']
            name = a_tag.text
            for author in author_list:
                if author['name'] == name:
                    author['url'] = url
        return author_list
    
    @staticmethod
    def crawl_citation(paper_element):
        tmp = paper_element.find('div', 'gs_flb').find_all('a')
        # Case 1) No citation
        if len(tmp) < 3:
            return 0
        # Case 2) citation count
        target_a = tmp[2]
        if 'cites' in target_a['href']:
            return int(re.findall(r'\d+', target_a.text)[0])
        # Case 3) No citation
        else:
            return 0

    @staticmethod
    def crawl_paper_info(paper_title):
        print(paper_title)
        html = Paper.get_html(paper_title)
        soup = BeautifulSoup(html, 'html.parser')
        paper_element = soup.find('div', class_='gs_r')
        import pdb; pdb.set_trace()
        authors = Paper.crawl_authors(paper_element)
        citation = Paper.crawl_citation(paper_element)
        res = {
            'authors': authors,
            'citation': citation
        }
        print('Crawled:', paper_title)
        return res

    @staticmethod
    def call_api(title):
        params = {
                'api_key': 'D1CCC9E99F4A4F01931C43E14ECC08BF',
                'search_type': 'scholar',
                'q': title,
                'include_html': 'true'
                }
        # make the http GET request to Scale SERP
        api_result = requests.get('https://api.scaleserp.com/search', params)
        return api_result.json()

    def get_paper_metadata(self, title):
        # get api_result 
        data = self.call_api(title)
        # 1) get_author
        try:
            author_list = data['scholar_results'][0]['displayed_link'].replace('…', '').split(' - ')[0].split(', ')
        except:
            author_list = []
        # 2) abstract
        try:
            abstract = data['scholar_results'][0]['snippet']
        except:
            abstract = ''
        # 3) venue
        try:
            venue = data['scholar_results'][0]['displayed_link'].replace('…', '').split(' - ')[1].split(', ')[0]
        except:
            venue = ''
        # 4) year
        try:
            year = data['scholar_results'][0]['displayed_link'].replace('…', '').split(' - ')[1].split(', ')[1]
        except:
            year = 0
        # 5) domain
        try:
            domain = data['scholar_results'][0]['domain']
        except:
            domain = ''
        # 6) url
        try:
            url = data['scholar_results'][0]['link']
        except:
            url= ''
        # 7) citation
        try:
            citation = data['scholar_results'][0]['cited_by_count']
        except:
            citation = 0
        # 8) cite_url
        try:
            cite_url = data['scholar_results'][0]['cited_by_link']
        except:
            cite_url = ''
        # 9) html
        html = data['html']

        res = {
            'author_list': author_list,
            'abstract': abstract,
            'venue': venue,
            'year': year,
            'domain': domain, 
            'url': url,
            'citation': citation,
            'cite_url': cite_url,
            'html': html
        }
        
        return res


    def save_pickle(self):
        if os.path.exists(self.cachepath):
            self.paper_df.to_pickle(self.cachepath + '_new')
        else:
            self.paper_df.to_pickle(self.cachepath)
        print('saved paper_df.')

    def update_all_metadata(self):
        # iterate for all rows
        
        for idx, row in self.paper_df.iterrows():
            title = row['title']
            if not row['html']:
                res = self.get_paper_metadata(title)
                for col in self.attr:
                    self.paper_df.loc[idx, col] = str(res[col])
                print('------------------------')
                print('update', title)
                print('------------------------')
        
        import pdb; pdb.set_trace()
        self.save_pickle()

        return
    
    def get_df(self):
        return self.paper_df