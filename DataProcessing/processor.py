import pandas as pd
import numpy as np
import json

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
df['children'] = [[] for _ in range(len(df))]
for i in range(len(df)):
    # update searched_papers
    if df.loc[i, 'logtype'] == 'paper':
        paper_id = df.loc[i, 'id']
        parent_id = df.loc[i-1, 'id']
        if paper_id not in df[df['id'] == parent_id].head(1).iloc[0]['searched_papers']:
            df[df['id'] == parent_id].head(1).iloc[0]['searched_papers'].append(paper_id)
    # update parent and children
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
                  df[df['id'] == parent_id].head(1).iloc[0]['children'].append(current_id)
          # multi action
          else:
              print('i-1')
              current_id = df.loc[i, 'id']
              parent_id = df.loc[i-1, 'id']
              df.loc[df['id'] == current_id, 'parent'] = parent_id
              df[df['id'] == parent_id].head(1).iloc[0]['children'].append(current_id)

# -------------------------------------------------------------------
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
    compressed_df = compressed_df.append(same_nodes.iloc[0], ignore_index=True)

# paper as csv
paper_df = compressed_df[compressed_df['logtype'] == 'paper']
action_df = compressed_df[compressed_df['logtype'] == 'action']

paper_df.to_csv('paper.csv')
action_df.to_csv('action.csv')

def makeTreeDFS(id, action_df):
    node = {'name': id, 'children': [], 'attributes': {}}
    # Fill the attributes
    tmp = action_df[action_df['id'] == id]
    searched_papers = tmp['searched_papers'].values[0]
    query = tmp['query'].values[0]
    citedBy = tmp['citedBy'].values[0]
    authorID = tmp['authorID'].values[0]
    year = tmp['startYear'].values[0]
    url = tmp['url'].values[0]
    timestamp_start = tmp['Timestamp'].values[0]
    timestamp_end = tmp['Timestamp_end'].values[0]

    node['attributes'] = {
        'searched_papers': searched_papers,
        'query': query if query != np.nan else "",
        'citedBy': citedBy if citedBy != np.nan else "",
        'authorID': authorID if authorID != np.nan else "",
        'year': year if year != np.nan else "",
        'url': url if url != np.nan else "",
        'timestamp_start': timestamp_start,
        'timestamp_end': timestamp_end,
    }
    # Find rows where 'parent' is the current id
    children_df = action_df[action_df['parent'] == id]
    

    for _, child_row in children_df.iterrows():
        c_id = child_row['id']
        node['children'].append(makeTreeDFS(c_id, action_df))

    return node


# Assuming action_df is your DataFrame
tree = []
root_ids = action_df[action_df['parent'].isnull()]['id']
for id in root_ids:
    tree.append(makeTreeDFS(id, action_df))

with open('actiontree.json', 'w') as file:
    json.dump(tree, file, indent=4)
