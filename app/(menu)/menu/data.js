// n = name, d = description, p = protein (g), c = calories (kcal), r = price (₹), t = tag
export const MENU = [
  { id:"oats", name:"Oat Bowls", sub:"Rolled oats, cooked fresh", items:[
    {n:"Classic Banana Honey Oats", d:"Oats cooked in milk, sliced banana, honey and a pinch of cinnamon.", p:11, c:340, r:99},
    {n:"Masala Veggie Oats", d:"Savoury oats with onion, tomato, carrot, peas and mild Indian spices.", p:8, c:260, r:89},
    {n:"Apple Cinnamon Walnut Oats", d:"Warm oats with stewed apple, cinnamon and crushed walnuts.", p:11, c:380, r:119},
    {n:"Peanut Butter Choco Oats", d:"Oats in milk with peanut butter, cocoa and banana.", p:17, c:450, r:129, t:"Bestseller"},
    {n:"Mango Chia Overnight Oats", d:"Chilled oats soaked in milk and curd with chia seeds and mango.", p:14, c:360, r:129},
    {n:"High-Protein Oats", d:"Oats in milk with a scoop of whey, almonds and pumpkin seeds.", p:32, c:480, r:169}
  ]},
  { id:"sandwich", name:"Sandwiches", sub:"Multigrain bread, grilled", items:[
    {n:"Veg Grilled Sandwich", d:"Cucumber, tomato, onion, capsicum and mint chutney.", p:9, c:290, r:89},
    {n:"Peanut Butter Banana Sandwich", d:"Peanut butter, banana slices and a drizzle of honey.", p:13, c:390, r:99},
    {n:"Chana Hummus Veggie Sandwich", d:"Homemade chickpea hummus with lettuce, carrot and cucumber.", p:14, c:360, r:119},
    {n:"Corn Spinach Cheese Sandwich", d:"Sweet corn and spinach with a light layer of cheese.", p:15, c:380, r:129},
    {n:"Tofu Bhurji Sandwich", d:"Spiced scrambled tofu with onion, tomato and coriander.", p:20, c:360, r:139},
    {n:"Paneer Tikka Sandwich", d:"Tandoori-marinated paneer, onion, capsicum and mint mayo.", p:22, c:420, r:149, t:"Bestseller"}
  ]},
  { id:"smoothie", name:"Smoothies", sub:"350 ml glass, no added sugar", items:[
    {n:"Green Glow", d:"Spinach, apple, cucumber, mint and lemon. Dairy-free.", p:3, c:140, r:99},
    {n:"Strawberry Banana", d:"Strawberry, banana and curd. Seasonal.", p:8, c:240, r:119},
    {n:"Mango Oats Smoothie", d:"Mango, oats, milk and a spoon of flax seeds.", p:10, c:310, r:109},
    {n:"Chikoo Date Shake", d:"Chikoo and dates blended with milk. Naturally sweet.", p:9, c:330, r:109},
    {n:"Banana Peanut Butter", d:"Banana, peanut butter, milk and a pinch of cinnamon.", p:15, c:380, r:119},
    {n:"Protein Power Smoothie", d:"Milk, banana, oats, almonds and a scoop of whey.", p:34, c:460, r:179, t:"Gym pick"}
  ]},
  { id:"salad", name:"Salads", sub:"Fresh greens, dressing on the side", items:[
    {n:"Sprouts Chaat Salad", d:"Moong sprouts, onion, tomato, cucumber, lemon and chaat masala.", p:13, c:210, r:89},
    {n:"Corn & Rajma Salad", d:"Kidney beans, sweet corn, capsicum and a lemon-herb dressing.", p:12, c:280, r:109},
    {n:"Kala Chana Salad", d:"Black chickpeas with onion, tomato, green chilli and coriander.", p:13, c:290, r:109},
    {n:"Quinoa Veggie Salad", d:"Quinoa, cucumber, cherry tomato, carrot and mint yogurt.", p:11, c:320, r:149},
    {n:"Tofu Peanut Salad", d:"Grilled tofu, cabbage, carrot and roasted peanut dressing.", p:20, c:340, r:149},
    {n:"Paneer Tikka Salad", d:"Grilled paneer on lettuce with onion, capsicum and mint curd.", p:21, c:330, r:159, t:"Bestseller"}
  ]},
  { id:"fruit", name:"Fruit Bowls", sub:"Cut fresh when you order", items:[
    {n:"Seasonal Fruit Bowl", d:"Four to five fruits of the season, lightly dusted with chaat masala.", p:2, c:150, r:79},
    {n:"Tropical Bowl", d:"Papaya, pineapple, banana and grated coconut.", p:3, c:200, r:89},
    {n:"Fruit & Curd Bowl", d:"Seasonal fruits over fresh curd with honey.", p:9, c:240, r:99},
    {n:"Fruit & Nut Bowl", d:"Seasonal fruits with almonds, walnuts and mixed seeds.", p:8, c:320, r:129},
    {n:"Hung Curd Parfait", d:"Layers of thick hung curd, fruits and crunchy oat granola.", p:16, c:350, r:139},
    {n:"PB Banana Smoothie Bowl", d:"Thick banana-peanut butter base topped with fruit, granola and seeds.", p:14, c:420, r:149}
  ]}
];

export const ADDONS = [
  {n:"Whey protein (1 scoop)", p:24, c:120, r:60},
  {n:"Extra paneer (50 g)", p:9, c:130, r:30},
  {n:"Peanut butter (1 tbsp)", p:4, c:95, r:20},
  {n:"Mixed nuts (15 g)", p:3, c:90, r:25},
  {n:"Chia or flax seeds (1 tbsp)", p:2, c:55, r:15},
  {n:"Honey (1 tsp)", p:0, c:20, r:10}
];
