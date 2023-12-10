import json

class JSONConverter:
    @staticmethod
    def np_to_json(npdata, filepath):
        npdata_list = npdata.tolist()
        with open(filepath, 'w') as f:
            json.dump(npdata_list, f)

    @staticmethod
    def df_to_json(dfdata, filepath, orient=''):
        if orient:
            dfdata.to_json(filepath, indent=4, orient=orient)
        else:
            dfdata = dfdata.transpose()
            dfdata.to_json(filepath, indent=4)

    @staticmethod
    def dict_to_json(dictdata, filepath):
        with open(filepath, 'w') as f:
            json.dump(dictdata, f, indent=4)