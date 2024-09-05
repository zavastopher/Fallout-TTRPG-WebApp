filename = input("Please provide file to read(hit enter for default):")
outfilename = input("Please provide file to write (hit enter for default):")
if filename == '':
    filename = 'gundata.csv'
if outfilename == '':
    outfilename = 'gundatainsertqueries.txt'
try:
    ammotypes = []
    seen = set(ammotypes)
    with open(outfilename,'w') as out:
        with open(filename) as f:
            f.readline()
            for line in f:
                tokenizedLine = line.split(',')
                ammoName = tokenizedLine[6].strip()
                if ammoName not in seen:
                    seen.add(ammoName)
                    ammotypes.append(ammoName)
                ammoId = ammotypes.index(ammoName)
                out.write(f'INSERT INTO gun (name,basecost,ap,damage,range,criticalhit,gunammotype,capacity,specialProperties,loadcost,strreq) Values (\'{tokenizedLine[0].strip()}\',{tokenizedLine[1].strip()},{tokenizedLine[2].strip()},\'{tokenizedLine[3].strip()}\',\'{tokenizedLine[4].strip()}\',\'{tokenizedLine[5].strip()}\',{ammoId + 1},{tokenizedLine[7].strip()},\'{tokenizedLine[8].strip()}\',{tokenizedLine[9].strip()},{tokenizedLine[10].strip()});\n')
            for ammo in ammotypes:
                out.write(f'INSERT INTO ammo (name) VALUES (\'{ammo}\');\n')
    f.close()
except Exception as e:
    print(f'There was an error reading the file!\n{e}')