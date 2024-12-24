from bs4 import BeautifulSoup

with open('set.xml', 'r', encoding='utf8', ) as f:
    data = f.read()
Bs_data = BeautifulSoup(data, "xml")
cards = Bs_data.find_all('card')

# arrays
by_cn = []
by_color = {"W": [], "U": [], "B": [], "R": [], "G": [], "M": [], "B": []}
by_rarity = {"C": [], "U": [], "R": [], "M": [], "B": []}
by_mv = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []}

mtg_colors = ["W", "U", "B", "R", "G"]

for card in cards:
    name = card.find('name').contents[0]
    number = card.find('number').contents[0]
    rarity = card.find('rarity').contents[0]
    cost = card.find('cost').contents[0] if len(card.find('cost').contents) > 0 else ""
    
    final_color = "C"
    modified_cost = cost.replace("X", "")
    mv = 0
    for color in mtg_colors:
        if color in cost:
            if final_color == "C":
                final_color = color
            else:
                final_color = "M"
            mv += modified_cost.count(color)
            modified_cost = modified_cost.replace(color, "")
    if cost == "":
        final_color = "L"
    if modified_cost != "":
        mv += int(modified_cost)
    
    by_cn.append(number)
    
    if final_color not in by_color:
        by_color[final_color] = []
    by_color[final_color].append(number)
    
    if rarity not in by_rarity:
        by_rarity[rarity] = []
    by_rarity[rarity].append(number)
    
    if mv not in by_mv:
        by_mv[mv] = []
    by_mv[mv].append(number)
    
w = open("cards.ts", "w")


w.write("export var by_cn = [\n")
w.write("    { title: '', cards: " + f"{by_cn}" + "}\n")
w.write("]\n")

w.write("export var by_color = [\n")
for color in by_color.keys():
    w.write("    { title: '" + color +  "', cards: " + f"{by_color[color]}" + "}, \n")
w.write("]\n")

w.write("export var by_rarity = [\n")
for rarity in by_rarity.keys():
    w.write("    { title: '" + rarity +  "', cards: " + f"{by_rarity[rarity]}" + "}, \n")
w.write("]\n")

w.write("export var by_mv = [\n")
for mv in by_mv.keys():
    w.write("    { title: '" + f"{mv}" +  "', cards: " + f"{by_mv[mv]}" + "}, \n")
w.write("]\n")


w.close()