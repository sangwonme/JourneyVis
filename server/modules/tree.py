import numpy as np
import json

class Tree:
    
    @staticmethod
    def makeTreeDFS(id, action_df):
        node = {'name': id, 'children': [], 'attributes': {}}
        # Fill the attributes
        tmp = action_df[action_df['id'] == id]
        node['attributes'] = tmp.squeeze().fillna('').to_dict()
        # Find rows where 'parent' is the current id
        children_df = action_df[action_df['parent'] == id]

        for _, child_row in children_df.iterrows():
            c_id = child_row['id']
            node['children'].append(Tree.makeTreeDFS(c_id, action_df))

        return node
    
    @staticmethod
    def makeTree(action_df):
        tree = []
        root_ids = action_df[action_df['parent'].isnull()]['id']
        for id in root_ids:
            tree.append(Tree.makeTreeDFS(id, action_df))
        # group the roots
        group_root_node = {'name':-99, 'children': tree, 'attributes':{}}
        return group_root_node