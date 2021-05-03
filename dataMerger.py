import csv
with open('data/national-use-of-force-participation-data.csv', mode='r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    states = {}
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            if row[3] != '':
                if row[0] in states:
                    states[row[0]]+=1
                else:
                    states[row[0]] = 1
    print(f'Processed {line_count} lines.')
    print(f'got {states}')
    
