import pandas as pd

# Specify the path to the CSV file
file_path = './data/search_logs.csv'

# Read the CSV file
df = pd.read_csv(file_path)

# Replace 'null' and '' as None
df = df.applymap(lambda x: None if (x == '' or x == 'null' or x == 'undefined') else x)

# TODO : remove redundant rows
redundant_rows = []
for i in range(2, len(df)):
    if df.loc[i, 'url'] == df.loc[i-2, 'url']:
        redundant_rows.append(i)
df.drop(redundant_rows)


import pdb; pdb.set_trace()

# TODO : 
