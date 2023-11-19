import pandas as pd
import numpy as np

# Specify the path to the CSV file
file_path = './data/search_logs.csv'

# Read the CSV file
df = pd.read_csv(file_path)

# Replace 'null' and '' as None
df = df.applymap(lambda x: np.nan if (x == '' or x == 'null' or x == 'undefined') else x)

# set id
df['id'] = None
nodes = {}
id = 1
for i in range(len(df)):
    # key is for checking redundant nodes
    key = ''
    if df.loc[i, 'logtype'] == 'paper':
        key = df.loc[i, 'title']
        for k in df.loc[i-1, 'query':'authorID'].values:
            key += str(k)
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

# set parent action node / set searched paper list
df['searched_papers'] = [[] for _ in range(len(df))]
df['parent'] = [None for _ in range(len(df))]
for i in range(len(df)):
    if df.loc[i, 'logtype'] == 'paper':
        paper_id = df.loc[i, 'id']
        parent_id = df.loc[i-1, 'id']
        if paper_id not in df[df['id'] == parent_id].head(1).iloc[0]['searched_papers']:
            df[df['id'] == parent_id].head(1).iloc[0]['searched_papers'].append(paper_id)
    else:
        action_num = df.loc[i, 'query':'authorID'].notnull().sum()
        print(i)
        # update only when there's no parent
        if df.loc[i, 'parent'] == None:
          # single action
          if action_num == 1:
              # when only query -> no parent
              if str(df.loc[i, 'query']) != 'nan':
                  pass
              # cited by / authorID -> paper's parent id
              else:
                  print('i-2')
                  current_id = df.loc[i, 'id']
                  parent_id = df.loc[i-2, 'id']
                  df.loc[df['id'] == current_id, 'parent'] = parent_id
          # multi action
          else:
              print('i-1')
              current_id = df.loc[i, 'id']
              parent_id = df.loc[i-1, 'id']
              df.loc[df['id'] == current_id, 'parent'] = parent_id

df.to_csv('test.csv')
import pdb; pdb.set_trace()

# TODO : 
