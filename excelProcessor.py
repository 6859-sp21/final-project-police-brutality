import pandas as pd

df_sheet_all = pd.read_excel('data/DISP_AllStatesAndTerritories.xlsx', sheet_name=None)

result = pd.concat(df_sheet_all, ignore_index=True, sort=False)


result.to_csv("data/all1033.csv", index=False)
