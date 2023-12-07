import pandas as pd
import json

class Graph:
    @staticmethod
    def create_action_graph(action_df):
        nodes = []
        links = []
        # create nodes and links
        for i in range(len(action_df)):
            row = action_df.iloc[i]
            # create node
            node = {
                "id": row['id']
            }
            nodes.append(node)
            # create link
            if row['parent']:
                link = {
                    "source": row['parent'],
                    "target": row['id'],
                    "link_type": row['link_type']
                }
                links.append(link)
        # graph
        graph = {
            "nodes": nodes,
            "links": links
        }
        return graph