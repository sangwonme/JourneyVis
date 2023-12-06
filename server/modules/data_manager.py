import pandas as pd
import numpy as np
import json

from modules.tree import Tree
from modules.paper import Paper
from modules.similarity import Similarity

class DataManager:
    def __init__(self, csv_data):
        self.data = self.create_id(csv_data)
        self.data = self.compress_df(self.data)
        # create paper DB
        paper_df = self.data[self.data['logtype'] == 'paper']
        paper_df = paper_df.loc[:,['id', 'title', 'Timestamp', 'Timestamp_end']]
        self.paper = Paper(paper_df)
        self.paper_df = self.paper.get_df()
        # create tree DB
        # TODO
        # create Similarity object
        self.sm = Similarity()
    
    def get_similarity_btw_papers(self, paper_list, title_weight):
        title_data = self.paper_df.loc[paper_list, 'title'].values
        title_sim_mat = self.sm.calculate_similarity(title_data)
        abstract_data = self.paper_df.loc[paper_list, 'abstract'].values
        abstract_sim_mat = self.sm.calculate_similarity(abstract_data)
        sim_mat = title_weight*(title_sim_mat) + (1-title_weight)*(abstract_sim_mat)
        return sim_mat

    # give id for every papers and actions considering redundant datas
    @staticmethod
    def create_id(csv_data):
        # Read the CSV file
        df = pd.read_csv(csv_data)
        # Replace 'null' and '' as None
        df = df.applymap(lambda x: np.nan if (x == '' or x == 'null' or x == 'undefined') else x)

        # set id
        df['id'] = None
        nodes = {}
        id = 1
        for i in range(len(df)):
            # key is for checking redundant nodes
            key = ''
            # CASE 1) Paper -> identify by its title
            if df.loc[i, 'logtype'] == 'paper':
                key = df.loc[i, 'title']
                for k in df.loc[i-1, 'query':'authorID'].values:
                    key += str(k)
            # CASE 2) Action -> identify by its query/year/citedBy/authorID
            elif df.loc[i, 'logtype'] == 'action':
                for k in df.loc[i, 'query':'authorID'].values:
                    key += str(k)
            # if key exist
            if key in nodes.keys():
                df.loc[i, 'id'] = nodes[key]
            else:
                nodes[key] = id
                df.loc[i, 'id'] = id
                id += 1
        
        return df
    
    @staticmethod
    def compress_df(df):
        # remove all redundant nodes
        df['Timestamp_end'] = [None for _ in range(len(df))]

        # Initialize compressed_df as an empty DataFrame with the same columns as df
        compressed_df = pd.DataFrame(columns=df.columns)

        for i in range(1, df['id'].max() + 1):
            same_nodes = df[df['id'] == i]
            end_time = same_nodes.iloc[-1]['Timestamp']  # Gets the last Timestamp
            df.loc[df['id'] == i, 'Timestamp_end'] = end_time
            same_nodes = df[df['id'] == i]
            # Append the first row of same_nodes to compressed_df
            compressed_df = compressed_df._append(same_nodes.iloc[0], ignore_index=True)

        return compressed_df