const terranInfo = [
  {
    nameZh: "奥林帕斯山",
    nameEn: "Olympus Mons",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card1.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-01.png",
    intro:
      "奥林帕斯山（Olympus Mons）位于火星北纬18.4°，东经226°。奥林帕斯山是火星上的盾状火山，亦为太阳系中已知最高的山，比珠穆拉玛峰高出两倍，与珠峰不同的是山顶覆盖的不是冰，而是干冰和沙尘。此处生存环境恶劣，除非经过严格训练的科考队员，否则请勿轻易前往",
  },
  {
    nameZh: "马沃斯谷",
    nameEn: "Mawrth Vallis",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card2.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-02.png",
    intro:
      "马沃斯谷（Mawrth Vallis）位于火星北纬22.36°, 东经343.5°。原先是一条火星古代的河道，在这里发现了可以用来保护微生物的黏土矿物质，或许这里是火星古老生命的重要遗迹。由于地形平坦且适合科考研究，是第一批火星移民的聚居基地，已经发展出新兴城镇，但也面临缺少生活用水的威胁。",
  },
  {
    nameZh: "希腊平原",
    nameEn: "Hellas Planitia",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card3.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-03.png",
    intro:
      "希腊平原（Hellas Planitia）位于火星的南纬42.7°，东经70.0°。39亿年前，一颗小行星重重地砸在火星上，形成了火星最大的撞击结构。液态水有可能稳定存在于此，或许这里将是人类未来的居住基地。",
  },
  {
    nameZh: "亚马逊平原",
    nameEn: "Amazonis Planitia",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card4.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-04.png",
    intro:
      "亚马逊平原（Amazonis Planitia）中心位于火星北纬24.74度，东经196度。亚马逊平原与地球上南美洲的亚马逊丛林没有直接的关系，这个名字来自于希腊一个全部由女性战士组成的部族，象征勇武刚毅。这块形成于一亿年前的沉积物区域是50年前NASA载人飞船在火星登陆的第一个着陆点",
  },
  {
    nameZh: "阿拉伯高地",
    nameEn: "Arabia Terra",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card5.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-05.png",
    intro:
      "阿拉伯高地（Arabia Terra）位于火星南纬19.79°，东经30°。可能是火星最古老的地区之一。在阿拉伯高地内有一些撞击坑之前都是大型湖泊。但截止2689年已经证明此地盐碱度过高，不适宜人类居住，但仍然有少量的探险爱好者在附近建造了临时营地。",
  },
  {
    nameZh: "塞东尼亚区",
    nameEn: "Cydonia",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card6.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-06.png",
    intro:
      "塞东尼亚区（Cydonia）是火星一个有许多小丘陵的区域，被认为是火星古代的海岸线。在这里被发现了“塞东尼亚迷宫”，有很多复杂的峡谷群。1976年，海盗1号传回的照片上被发现了“火星脸”，引发UFO爱好者的热烈讨论，实际上，随着火星图像的日益清晰，被证明这些“火星脸”不过是一个错视，因为角度和光线的关系看起来有点像人脸而已。",
  },
  {
    nameZh: "大瑟提斯高原",
    nameEn: "Syrtis Major Planum",
    cardImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-card7.png",
    terranImg: "https://marx-1257249827.cos.ap-guangzhou.myqcloud.com/images/terran-07.png",
    intro:
      "大瑟提斯高原（Syrtis Major Planum）中央位于北纬8.4度，东经69.5度。大瑟提斯高原是一座低缓的盾状火山，常年被沙子覆盖，呈现黑色。火山口出现了一小批的植物，可以抵御阳光辐射，因此较为适宜人类居住",
  },
];

const genders = ["男", "女"];

const earthCountries = [
  {
    value: "China",
    label: "中国",
  },
  {
    value: "Angola",
    label: "安哥拉",
  },
  {
    value: "Afghanistan",
    label: "阿富汗",
  },
  {
    value: "Albania",
    label: "阿尔巴尼亚",
  },
  {
    value: "Algeria",
    label: "阿尔及利亚",
  },
  {
    value: "Andorra",
    label: "安道尔共和国",
  },
  {
    value: "Anguilla",
    label: "安圭拉岛",
  },
  {
    value: "Antigua and Barbuda",
    label: "安提瓜和巴布达",
  },
  {
    value: "Argentina",
    label: "阿根廷",
  },
  {
    value: "Armenia",
    label: "亚美尼亚",
  },
  {
    value: "Ascension",
    label: "阿森松",
  },
  {
    value: "Australia",
    label: "澳大利亚",
  },
  {
    value: "Austria",
    label: "奥地利",
  },
  {
    value: "Azerbaijan",
    label: "阿塞拜疆",
  },
  {
    value: "Bahamas",
    label: "巴哈马",
  },
  {
    value: "Bahrain",
    label: "巴林",
  },
  {
    value: "Bangladesh",
    label: "孟加拉国",
  },
  {
    value: "Barbados",
    label: "巴巴多斯",
  },
  {
    value: "Belarus",
    label: "白俄罗斯",
  },
  {
    value: "Belgium",
    label: "比利时",
  },
  {
    value: "Belize",
    label: "伯利兹",
  },
  {
    value: "Benin",
    label: "贝宁",
  },
  {
    value: "Bermuda Is",
    label: "百慕大群岛",
  },
  {
    value: "Bolivia",
    label: "玻利维亚",
  },
  {
    value: "Botswana",
    label: "博茨瓦纳",
  },
  {
    value: "Brazil",
    label: "巴西",
  },
  {
    value: "Brunei",
    label: "文莱",
  },
  {
    value: "Bulgaria",
    label: "保加利亚",
  },
  {
    value: "Burkina Faso",
    label: "布基纳法索",
  },
  {
    value: "Burma",
    label: "缅甸",
  },
  {
    value: "Burundi",
    label: "布隆迪",
  },
  {
    value: "Cameroon",
    label: "喀麦隆",
  },
  {
    value: "Canada",
    label: "加拿大",
  },
  {
    value: "Cayman Is",
    label: "开曼群岛",
  },
  {
    value: "Central African Republic",
    label: "中非共和国",
  },
  {
    value: "Chad",
    label: "乍得",
  },
  {
    value: "Chile",
    label: "智利",
  },
  {
    value: "Colombia",
    label: "哥伦比亚",
  },
  {
    value: "Congo",
    label: "刚果",
  },
  {
    value: "Cook Is",
    label: "库克群岛",
  },
  {
    value: "Costa Rica",
    label: "哥斯达黎加",
  },
  {
    value: "Cuba",
    label: "古巴",
  },
  {
    value: "Cyprus",
    label: "塞浦路斯",
  },
  {
    value: "Czech Republic",
    label: "捷克",
  },
  {
    value: "Denmark",
    label: "丹麦",
  },
  {
    value: "Djibouti",
    label: "吉布提",
  },
  {
    value: "Dominica Rep",
    label: "多米尼加共和国",
  },
  {
    value: "Ecuador",
    label: "厄瓜多尔",
  },
  {
    value: "Egypt",
    label: "埃及",
  },
  {
    value: "EI Salvador",
    label: "萨尔瓦多",
  },
  {
    value: "Estonia",
    label: "爱沙尼亚",
  },
  {
    value: "Ethiopia",
    label: "埃塞俄比亚",
  },
  {
    value: "Fiji",
    label: "斐济",
  },
  {
    value: "Finland",
    label: "芬兰",
  },
  {
    value: "France",
    label: "法国",
  },
  {
    value: "French Guiana",
    label: "法属圭亚那",
  },
  {
    value: "French Polynesia",
    label: "法属玻利尼西亚",
  },
  {
    value: "Gabon",
    label: "加蓬",
  },
  {
    value: "Gambia",
    label: "冈比亚",
  },
  {
    value: "Georgia",
    label: "格鲁吉亚",
  },
  {
    value: "Ghana",
    label: "加纳",
  },
  {
    value: "Gibraltar",
    label: "直布罗陀",
  },
  {
    value: "Greece",
    label: "希腊",
  },
  {
    value: "Grenada",
    label: "格林纳达",
  },
  {
    value: "Guam",
    label: "关岛",
  },
  {
    value: "Guatemala",
    label: "危地马拉",
  },
  {
    value: "Guinea",
    label: "几内亚",
  },
  {
    value: "Guyana",
    label: "圭亚那",
  },
  {
    value: "Haiti",
    label: "海地",
  },
  {
    value: "Honduras",
    label: "洪都拉斯",
  },
  {
    value: "Hungary",
    label: "匈牙利",
  },
  {
    value: "Iceland",
    label: "冰岛",
  },
  {
    value: "India",
    label: "印度",
  },
  {
    value: "Indonesia",
    label: "印度尼西亚",
  },
  {
    value: "Iran",
    label: "伊朗",
  },
  {
    value: "Iraq",
    label: "伊拉克",
  },
  {
    value: "Ireland",
    label: "爱尔兰",
  },
  {
    value: "Israel",
    label: "以色列",
  },
  {
    value: "Italy",
    label: "意大利",
  },
  {
    value: "Ivory Coast",
    label: "科特迪瓦",
  },
  {
    value: "Jamaica",
    label: "牙买加",
  },
  {
    value: "Japan",
    label: "日本",
  },
  {
    value: "Jordan",
    label: "约旦",
  },
  {
    value: "Kampuchea (Cambodia )",
    label: "柬埔寨",
  },
  {
    value: "Kazakstan",
    label: "哈萨克斯坦",
  },
  {
    value: "Kenya",
    label: "肯尼亚",
  },
  {
    value: "Korea",
    label: "韩国",
  },
  {
    value: "Kuwait",
    label: "科威特",
  },
  {
    value: "Kyrgyzstan",
    label: "吉尔吉斯坦",
  },
  {
    value: "Laos",
    label: "老挝",
  },
  {
    value: "Latvia",
    label: "拉脱维亚",
  },
  {
    value: "Lebanon",
    label: "黎巴嫩",
  },
  {
    value: "Lesotho",
    label: "莱索托",
  },
  {
    value: "Liberia",
    label: "利比里亚",
  },
  {
    value: "Libya",
    label: "利比亚",
  },
  {
    value: "Liechtenstein",
    label: "列支敦士登",
  },
  {
    value: "Lithuania",
    label: "立陶宛",
  },
  {
    value: "Luxembourg",
    label: "卢森堡",
  },
  {
    value: "Madagascar",
    label: "马达加斯加",
  },
  {
    value: "Malawi",
    label: "马拉维",
  },
  {
    value: "Malaysia",
    label: "马来西亚",
  },
  {
    value: "Maldives",
    label: "马尔代夫",
  },
  {
    value: "Mali",
    label: "马里",
  },
  {
    value: "Malta",
    label: "马耳他",
  },
  {
    value: "Mariana Is",
    label: "马里亚那群岛",
  },
  {
    value: "Martinique",
    label: "马提尼克",
  },
  {
    value: "Mauritius",
    label: "毛里求斯",
  },
  {
    value: "Mexico",
    label: "墨西哥",
  },
  {
    value: "Moldova",
    label: "摩尔多瓦",
  },
  {
    value: "Monaco",
    label: "摩纳哥",
  },
  {
    value: "Mongolia",
    label: "蒙古",
  },
  {
    value: "Montserrat Is",
    label: "蒙特塞拉特岛",
  },
  {
    value: "Morocco",
    label: "摩洛哥",
  },
  {
    value: "Mozambique",
    label: "莫桑比克",
  },
  {
    value: "Namibia",
    label: "纳米比亚",
  },
  {
    value: "Nauru",
    label: "瑙鲁",
  },
  {
    value: "Nepal",
    label: "尼泊尔",
  },
  {
    value: "Netheriands Antilles",
    label: "荷属安的列斯",
  },
  {
    value: "Netherlands",
    label: "荷兰",
  },
  {
    value: "New Zealand",
    label: "新西兰",
  },
  {
    value: "Nicaragua",
    label: "尼加拉瓜",
  },
  {
    value: "Niger",
    label: "尼日尔",
  },
  {
    value: "Nigeria",
    label: "尼日利亚",
  },
  {
    value: "North Korea",
    label: "朝鲜",
  },
  {
    value: "Norway",
    label: "挪威",
  },
  {
    value: "Oman",
    label: "阿曼",
  },
  {
    value: "Pakistan",
    label: "巴基斯坦",
  },
  {
    value: "Panama",
    label: "巴拿马",
  },
  {
    value: "Papua New Cuinea",
    label: "巴布亚新几内亚",
  },
  {
    value: "Paraguay",
    label: "巴拉圭",
  },
  {
    value: "Peru",
    label: "秘鲁",
  },
  {
    value: "Philippines",
    label: "菲律宾",
  },
  {
    value: "Poland",
    label: "波兰",
  },
  {
    value: "Portugal",
    label: "葡萄牙",
  },
  {
    value: "Puerto Rico",
    label: "波多黎各",
  },
  {
    value: "Qatar",
    label: "卡塔尔",
  },
  {
    value: "Reunion",
    label: "留尼旺",
  },
  {
    value: "Romania",
    label: "罗马尼亚",
  },
  {
    value: "Russia",
    label: "俄罗斯",
  },
  {
    value: "Saint Lueia",
    label: "圣卢西亚",
  },
  {
    value: "Saint Vincent",
    label: "圣文森特岛",
  },
  {
    value: "Samoa Eastern",
    label: "东萨摩亚(美)",
  },
  {
    value: "Samoa Western",
    label: "西萨摩亚",
  },
  {
    value: "San Marino",
    label: "圣马力诺",
  },
  {
    value: "Sao Tome and Principe",
    label: "圣多美和普林西比",
  },
  {
    value: "Saudi Arabia",
    label: "沙特阿拉伯",
  },
  {
    value: "Senegal",
    label: "塞内加尔",
  },
  {
    value: "Seychelles",
    label: "塞舌尔",
  },
  {
    value: "Sierra Leone",
    label: "塞拉利昂",
  },
  {
    value: "Singapore",
    label: "新加坡",
  },
  {
    value: "Slovakia",
    label: "斯洛伐克",
  },
  {
    value: "Slovenia",
    label: "斯洛文尼亚",
  },
  {
    value: "Solomon Is",
    label: "所罗门群岛",
  },
  {
    value: "Somali",
    label: "索马里",
  },
  {
    value: "South Africa",
    label: "南非",
  },
  {
    value: "Spain",
    label: "西班牙",
  },
  {
    value: "SriLanka",
    label: "斯里兰卡",
  },
  {
    value: "St.Lucia",
    label: "圣卢西亚",
  },
  {
    value: "St.Vincent",
    label: "圣文森特",
  },
  {
    value: "Sudan",
    label: "苏丹",
  },
  {
    value: "Suriname",
    label: "苏里南",
  },
  {
    value: "Swaziland",
    label: "斯威士兰",
  },
  {
    value: "Sweden",
    label: "瑞典",
  },
  {
    value: "Switzerland",
    label: "瑞士",
  },
  {
    value: "Syria",
    label: "叙利亚",
  },
  {
    value: "Tajikstan",
    label: "塔吉克斯坦",
  },
  {
    value: "Tanzania",
    label: "坦桑尼亚",
  },
  {
    value: "Thailand",
    label: "泰国",
  },
  {
    value: "Togo",
    label: "多哥",
  },
  {
    value: "Tonga",
    label: "汤加",
  },
  {
    value: "Trinidad and Tobago",
    label: "特立尼达和多巴哥",
  },
  {
    value: "Tunisia",
    label: "突尼斯",
  },
  {
    value: "Turkey",
    label: "土耳其",
  },
  {
    value: "Turkmenistan",
    label: "土库曼斯坦",
  },
  {
    value: "Uganda",
    label: "乌干达",
  },
  {
    value: "Ukraine",
    label: "乌克兰",
  },
  {
    value: "United Arab Emirates",
    label: "阿拉伯联合酋长国",
  },
  {
    value: "United Kiongdom",
    label: "英国",
  },
  {
    value: "United States of America",
    label: "美国",
  },
  {
    value: "Uruguay",
    label: "乌拉圭",
  },
  {
    value: "Uzbekistan",
    label: "乌兹别克斯坦",
  },
  {
    value: "Venezuela",
    label: "委内瑞拉",
  },
  {
    value: "Vietnam",
    label: "越南",
  },
  {
    value: "Yemen",
    label: "也门",
  },
  {
    value: "Yugoslavia",
    label: "南斯拉夫",
  },
  {
    value: "Zimbabwe",
    label: "津巴布韦",
  },
  {
    value: "Zaire",
    label: "扎伊尔",
  },
  {
    value: "Zambia",
    label: "赞比亚",
  },
];

const rules = {
  name: {
    required: true,
  },
  gender: {
    required: true,
  },
  earthCountry: {
    required: true,
  },
  marsArea: {
    required: true,
  },
};
const messages = {
  name: {
    required: "请输入昵称",
  },
  gender: {
    required: "请选择性别",
  },
  earthCountry: {
    required: "请选择地球国籍",
  },
  marsArea: {
    required: "请选择火星归属地",
  },
};

export { terranInfo, genders, earthCountries, rules, messages };
