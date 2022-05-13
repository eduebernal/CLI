# Setup
- You need [node](https://nodejs.org/en/) installed in your computer
- Clone repo or download zip
- Download dependencies an link packages:
```
npm install
sudo npm link
```
- Run with "myledger"
# Features
### Commands
print                          Prints journal file  
register                    Generate register report  _(partially done)_   
balance                       Generate balance report  _(pending)_  
  
### Flags
-f --file                     Specify a journal file  
-s --sort                   Sort entries by specified criteria _(pending)_  
-p --price-db          Translate commodity prices to main currency _(pending)_  

# Usage
```
myledger -f ledger.index print
```
A bash script is also included in the folder, the file and sort flags are always called in this script
```
bash my-ledger.sh reg
```
# TO DO
- Choose an adequate data structure to store data from each entry
- Finish implementing register command (align output format, consider different currencies)
- Implement balance command (need item 1 of the list)
- Implement sort flag (by date and by amount)
- Implement price-db flag (save set of unique currencies and convert on write)
- Implement optional filter words (The CLI accepts the additional arguments, it does nothing with them)

# Screenshots
### Print
![image](https://user-images.githubusercontent.com/92958867/168228432-5891d153-2367-4342-8e00-1b0b1a2da833.png)

### Register (WIP)
![image](https://user-images.githubusercontent.com/92958867/168228669-671453bc-c8f2-4985-8657-b3ef3775eba7.png)

