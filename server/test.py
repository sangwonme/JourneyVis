from modules.data_manager import DataManager

file_path = './data/sample.csv'
dm = DataManager(file_path)
tmp = dm.get_similarity_btw_papers([2, 4, 5, 21, 26, 30], title_weight=0.8)
import pdb; pdb.set_trace()