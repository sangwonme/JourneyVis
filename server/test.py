from modules.data_manager import DataManager

file_path = './data/sample.csv'
dm = DataManager(file_path)
dm.export_data()
import pdb; pdb.set_trace()