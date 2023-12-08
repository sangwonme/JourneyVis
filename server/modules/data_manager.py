import pandas as pd
import numpy as np
import json
import os

from modules.action import Action
from modules.paper import Paper
from modules.similarity import Similarity
from modules.graph import Graph
from modules.tree import Tree
from modules.json_converter import JSONConverter

class DataManager:
    def __init__(self, csv_data):
        self.data = self.create_id(csv_data)
        # create paper DB
        paper_input = self.compress_df(self.data)
        paper_input = paper_input[paper_input['logtype'] == 'paper']
        paper_input = paper_input.loc[:,['id', 'title', 'Timestamp', 'Timestamp_end']]
        self.paper = Paper(paper_input)
        self.paper_df = self.paper.get_df()
        # create tree DB
        self.action = Action(self.data)
        self.action_df = self.compress_df(self.action.get_df()) #compress after retreiving the df
        self.action_df = self.action_df[self.action_df['logtype'] == 'action']
        self.action_df = self.action_df.loc[:, ['id', 'query', 'startYear', 'endYear', 'citedBy', 'authorID', 'url', 'searched_papers', 'papers_num', 'parent', 'children', 'link_type', 'seedpaper_id', 'Timestamp', 'Timestamp_end']]
        self.action_tree = Tree.makeTree(self.action_df)
        # create Similarity object
        self.sm = Similarity()
        self.sim_mat = self.get_similarity_btw_papers(self.paper_df.index)
        # create Action Graph
        # self.action_graph = Graph.create_action_graph(self.action_df)
        
    
    def get_similarity_btw_papers(self, paper_list, title_weight=0.8):
        title_data = self.paper_df.loc[paper_list, 'title'].values
        title_sim_mat = self.sm.calculate_similarity(title_data)
        abstract_data = self.paper_df.loc[paper_list, 'abstract'].values
        abstract_sim_mat = self.sm.calculate_similarity(abstract_data)
        sim_mat = title_weight*(title_sim_mat) + (1-title_weight)*(abstract_sim_mat)
        return sim_mat

    def export_data(self):
        BASE_URL = './data_output'
        JSONConverter.df_to_json(self.paper_df.set_index('id').drop('html', axis=1), os.path.join(BASE_URL, 'paper_df.json'))
        JSONConverter.df_to_json(self.action_df.set_index('id'), os.path.join(BASE_URL, 'action_df.json'))
        JSONConverter.dict_to_json(self.action_tree, os.path.join(BASE_URL, 'action_graph.json'))
        JSONConverter.np_to_json(self.sim_mat, os.path.join(BASE_URL, 'sim_mat.json'))
        
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
        id = 0
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

        for i in range(0, df['id'].max() + 1):
            same_nodes = df[df['id'] == i]
            end_time = same_nodes.iloc[-1]['Timestamp']  # Gets the last Timestamp
            df.loc[df['id'] == i, 'Timestamp_end'] = end_time
            same_nodes = df[df['id'] == i]
            # Append the first row of same_nodes to compressed_df
            compressed_df = compressed_df._append(same_nodes.iloc[0], ignore_index=True)

        return compressed_df
    