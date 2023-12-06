# from modules.data_manager import DataManager

# file_path = './data/sample.csv'
# dm = DataManager(file_path)

from modules.similarity import Similarity

# Example usage
text_list = ["I love machine learning", "I adore artificial intelligence", "Deep learning is fascinating"]

sm = Similarity()
mat = sm.calculate_similarity(text_list)
print(mat)
import pdb; pdb.set_trace()