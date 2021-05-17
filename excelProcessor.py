import pandas as pd

df_sheet_all = pd.read_excel('data/DISP_AllStatesAndTerritories.xlsx', sheet_name=None)

result = pd.concat(df_sheet_all, ignore_index=True, sort=False)
CA = df_sheet_all['California']
print(CA.dtypes)
categoryA = CA.loc[(pd.DatetimeIndex(CA['Ship Date']).year <= 2017) & (CA['DEMIL Code'] == 'A')]
print(categoryA['Acquisition Value'].sum())

# result.to_csv("data/all1033.csv", index=False)
columns = ['year', 'A', 'B', 'C', 'D', 'E', 'F', 'Q']
data = []

for year in range(1991, 2018):
    row = [year, ]
    for category in columns[1:]:
        row.append(result.loc[(pd.DatetimeIndex(result['Ship Date']).year <= year) & (result['DEMIL Code'] == category)]['Acquisition Value'].sum())
    data.append(row)

timeSeriesCategories = pd.DataFrame(data, columns=columns)
timeSeriesCategories.to_csv("data/all1033Categories.csv", index=False)
