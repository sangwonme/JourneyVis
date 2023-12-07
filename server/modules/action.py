import requests
import re
import json
import pickle
import numpy as np
import pandas as pd
import os

class Action:
    def __init__(self, full_data):
        self.cachepath = './cache/actiondf.pkl'
        try:
            self.action_df = pd.read_pickle(self.cachepath)
            print('load action_df pickle.')
        except:
            self.action_df = self.create_action(full_data)
            self.save_pickle()
            
    # df(full_data) -> create action
    @staticmethod
    def create_action(df):
        # add columns
        df['searched_papers'] = [[] for _ in range(len(df))]
        df['parent'] = [None for _ in range(len(df))]
        df['link_type'] = [None for _ in range(len(df))]
        df['seedpaper_id'] = [None for _ in range(len(df))]
        df['children'] = [[] for _ in range(len(df))]
        # loop for all nodes
        for i in range(len(df)):
            row = df.iloc[i]
            # update searched_papers of previous action when paper node met
            if row['logtype'] == 'paper':
                paper_id = row['id']
                parent_id = df.loc[i-1, 'id']
                if paper_id not in df[df['id'] == parent_id].head(1).iloc[0]['searched_papers']:
                    df[df['id'] == parent_id].head(1).iloc[0]['searched_papers'].append(paper_id)
            else:
                # update parent and child
                param_num = df.loc[i, 'query':'authorID'].notnull().sum() #get the num of url params
                # update only when no parent
                if df.loc[i, 'parent'] == None:
                    # single action
                    if param_num == 1:
                        # when only query -> no parent
                        if str(df.loc[i, 'query']) != 'nan':
                            pass
                        # cited by / authorID -> paper's parent id
                        else:
                            current_id = df.loc[i, 'id']
                            paper_id = df.loc[i-1, 'id']
                            parent_id = df.loc[i-2, 'id']
                            df.loc[df['id'] == current_id, 'parent'] = parent_id
                            df.loc[df['id'] == current_id, 'link_type'] = 'same_author' if not str(df.loc[i]['authorID']) == 'nan' else 'cited_by'
                            df.loc[df['id'] == current_id, 'seedpaper_id'] = paper_id
                            df[df['id'] == parent_id].head(1).iloc[0]['children'].append(current_id)
                    # multi action
                    else:
                        current_id = df.loc[i, 'id']
                        parent_id = df.loc[i-1, 'id']
                        df.loc[df['id'] == current_id, 'parent'] = parent_id
                        df.loc[df['id'] == current_id, 'link_type'] = 'advanced_search'
                        df[df['id'] == parent_id].head(1).iloc[0]['children'].append(current_id)
        return df

    def save_pickle(self):
        self.action_df.to_pickle(self.cachepath)
        print('saved action_df.')

    def get_df(self):
        return self.action_df
    