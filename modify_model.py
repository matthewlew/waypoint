import re

with open('index.html', 'r') as f:
    content = f.read()

# mkItem refactor
new_mkItem = """function mkItem(name,catIds=[],bagIds=[],purIds=[],carry=false,note='',auto=false){
  return{id:'item-'+(itemIdSeq++),name,categoryIds:Array.isArray(catIds)?catIds:(catIds?[catIds]:[]),bagIds:Array.isArray(bagIds)?bagIds:(bagIds?[bagIds]:[]),purposeIds:Array.isArray(purIds)?purIds:(purIds?[purIds]:[]),
    carry,checked:false,auto,note,dayIds:[],scenarios:[]};
}"""
content = re.sub(r'function mkItem\(name,catId,bagId,purId,carry=false,note=\'\',auto=false\)\{\s*return\{id:\'item-\'\+\(itemIdSeq\+\+\),name,categoryId:catId,bagId,purposeId:purId,\s*carry,checked:false,auto,note\};\s*\}', new_mkItem, content)


with open('index.html', 'w') as f:
    f.write(content)
