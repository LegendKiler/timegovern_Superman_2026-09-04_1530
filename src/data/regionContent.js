// Per-region long-form content — used by RegionDetailPage.jsx to expand each region's page.
// Keyed by URL slug (matches useParams().slug).

export const REGION_CONTENT = {
  'north-america': {
    intro: 'North America is the third-largest continent by area and the third-largest by population, comprising the United States, Canada, Mexico, and a handful of smaller nations grouped here for statistical purposes. The region is defined economically by the USMCA (formerly NAFTA) trade agreement, which binds Canada, Mexico, and the United States into one of the most integrated economic blocs in the world. It is also the wealthiest region on Earth by aggregate GDP, home to the largest national economy and two of the most advanced industrial and technological powerhouses. Despite its population being roughly a third of Asia\u2019s, North America generates nearly a quarter of global economic output.',
    highlights: [
      'Land area spanning three massive countries across more than 24 million square kilometers.',
      'The world\u2019s highest regional GDP, with the United States accounting for roughly 85% of the total.',
      'Aging population dynamics \u2014 median ages in Canada and the US are well above 38 years.',
      'One of the world\u2019s largest integrated trade blocs, connecting 500+ million consumers.'
    ],
    context: 'The United States dominates every economic metric in this region, contributing more than $25 trillion in annual GDP \u2014 larger than the next three largest national economies combined. Canada, despite its vast landmass, has just 40 million people and an economy driven by natural resources, financial services, and an advanced tech sector concentrated in Toronto, Vancouver, and Montreal. Mexico\u2019s 130 million people and $1.7 trillion economy make it the region\u2019s manufacturing and agricultural backbone, particularly for automobiles, electronics, and produce exported northward under USMCA rules. The three economies are so interdependent that supply chains routinely cross borders multiple times during the assembly of a single product.'
  },
  'central-america': {
    intro: 'Central America is a narrow isthmus connecting North America to South America, comprising seven countries: Belize, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, and Panama. The region sits at the boundary of three tectonic plates, producing a volcanic spine that runs from Guatemala to Panama and making the area prone to earthquakes and hurricanes. Its location between the Atlantic and Pacific oceans made it strategically vital for global trade \u2014 the Panama Canal remains one of the world\u2019s most important shipping routes, carrying approximately 5% of global maritime commerce. Population and economic output are heavily skewed toward Guatemala, which accounts for roughly a third of the region\u2019s people, and toward Panama and Costa Rica, which have the highest GDP per capita.',
    highlights: [
      'Seven countries spanning just 520,000 square kilometers \u2014 smaller than France.',
      'The Panama Canal generates over $4 billion per year for Panama alone.',
      'One of the most biodiverse regions in the world, with cloud forests and coral reefs.',
      'Coffee, bananas, and tourism dominate exports across most of the region.'
    ],
    context: 'Guatemala is the most populous country in Central America with approximately 18 million people, but its GDP per capita remains below $6,000 \u2014 well under the regional average. Costa Rica and Panama have transitioned into service-based economies with strong tourism, technology, and financial sectors, and both rank as upper-middle-income countries. The remaining countries \u2014 El Salvador, Honduras, and Nicaragua \u2014 have struggled with slower growth, political instability, and significant outmigration to the United States. Belize is the smallest and least populated but has the highest coral reef coverage in the Western Hemisphere. Despite shared geography, the economic experience of Central American countries is remarkably diverse.'
  },
  'south-america': {
    intro: 'South America is the fourth-largest continent by area and fifth by population, comprising twelve sovereign nations and a handful of overseas territories. The continent is dominated physically by two immense features: the Amazon rainforest, the largest tropical forest on Earth covering over 5.5 million square kilometers, and the Andes mountains, the world\u2019s longest continental mountain range at roughly 7,000 kilometers. Brazil is by far the largest country, containing roughly half of both the region\u2019s land area and its population. The continent is one of the world\u2019s great agricultural and mineral exporters \u2014 coffee, soybeans, iron ore, copper, and lithium all flow outward to global markets, and South America holds a substantial portion of the world\u2019s lithium reserves in the \u2018lithium triangle\u2019 spanning Chile, Argentina, and Bolivia.',
    highlights: [
      'Twelve countries plus French Guiana, spanning 17.8 million square kilometers.',
      'The Amazon absorbs roughly 2 billion tons of CO2 per year \u2014 a critical carbon sink.',
      'Brazil alone accounts for over 50% of the region\u2019s population and GDP.',
      'Home to the lithium triangle \u2014 the world\u2019s largest lithium reserves.'
    ],
    context: 'Brazil\u2019s $2.1 trillion economy and 215 million people make it the dominant force in South America, and its industrial and agricultural output positions it as one of the BRICS economies. Argentina, historically one of the wealthiest countries in the world, has struggled with recurring inflation and debt crises but remains a significant agricultural producer. Chile has the highest GDP per capita in the region and is the world\u2019s largest copper exporter. Colombia and Peru have seen strong growth in recent decades while remaining challenged by inequality and internal conflict. The region\u2019s overall population is around 430 million, with urbanization rates comparable to Europe, and Spanish remains the dominant language outside Brazil where Portuguese is spoken.'
  },
  'oceania': {
    intro: 'Oceania is the smallest continent by land area but one of the most geographically dispersed regions in the world \u2014 a collection of fourteen sovereign nations and dozens of territories scattered across the Pacific Ocean. Australia dominates every meaningful statistic, containing over 85% of the region\u2019s land and 65% of its population, and its economy alone represents roughly 85% of regional GDP. The rest of Oceania is a patchwork of Pacific island nations \u2014 New Zealand, Papua New Guinea, Fiji, the Solomon Islands, Vanuatu, Samoa, Tonga, and several others \u2014 many of which are small island states vulnerable to climate change and heavily dependent on tourism, remittances, and foreign aid.',
    highlights: [
      'Fourteen countries spread across 8.5 million square kilometers of ocean territory.',
      'Australia accounts for 85% of regional land area and economy.',
      'Pacific island nations are on the front line of sea-level rise and cyclones.',
      'Papua New Guinea alone has over 800 languages \u2014 12% of the world\u2019s total.'
    ],
    context: 'Australia\u2019s $1.7 trillion economy, advanced industrial base, and 26 million population position it as a high-income country and a major exporter of iron ore, coal, natural gas, and agricultural products. New Zealand, with 5 million people and a $250 billion economy, specializes in dairy, tourism, and increasingly software. Papua New Guinea has significant mineral wealth \u2014 gold, copper, and natural gas \u2014 but its development has been uneven and its 10 million people remain largely rural. The smaller Pacific island states face acute challenges from climate change, limited economic diversification, and geographic isolation, and several maintain close constitutional relationships with former colonial powers that shape their foreign policy and migration patterns.'
  },
  'middle-east': {
    intro: 'The Middle East spans roughly seventeen countries across Western Asia and North Africa, from the Levant in the west to Iran in the east, and from Turkey in the north to Yemen in the south. The region is the historic cradle of three major world religions \u2014 Judaism, Christianity, and Islam \u2014 and remains a central focus of global geopolitics due to its massive energy reserves, strategic waterways, and long-running conflicts. It holds approximately half of the world\u2019s proven oil reserves and about 40% of its natural gas, and the Gulf states alone account for over a quarter of global oil production. At the same time, the region is remarkably diverse economically, ranging from oil-wealthy Gulf Cooperation Council states to lower-income economies like Yemen and Syria that are struggling with conflict and instability.',
    highlights: [
      'Roughly 17 countries containing 3% of the world\u2019s population but 40% of its natural gas reserves.',
      'Saudi Arabia\u2019s $1.1 trillion economy is the region\u2019s largest.',
      'The UAE has transformed from oil dependence into a diversified financial and tourism hub.',
      'Israel has emerged as a globally recognized technology and innovation leader.'
    ],
    context: 'The Gulf Cooperation Council states \u2014 Saudi Arabia, the UAE, Qatar, Kuwait, Bahrain, and Oman \u2014 account for the vast majority of regional energy exports and have accumulated some of the world\u2019s largest sovereign wealth funds. Saudi Arabia\u2019s Vision 2030 program aims to diversify beyond oil, while the UAE has already built a substantial non-oil economy anchored by Dubai\u2019s logistics, finance, and tourism sectors. Iran, despite its large population and oil reserves, is constrained by sanctions. Israel has one of the highest GDP per capita in the region and a world-leading technology sector. Turkey straddles Europe and Asia and is both one of the region\u2019s largest economies and its most geopolitically complex member. Meanwhile, Yemen, Syria, and Lebanon continue to face severe economic challenges from conflict and instability.'
  },
  'caribbean': {
    intro: 'The Caribbean is a region of more than 7,000 islands, islets, and cays in the Caribbean Sea, comprising thirteen sovereign nations and about a dozen overseas territories belonging to the UK, France, the Netherlands, and the United States. The region is divided into two major island chains \u2014 the Greater Antilles (Cuba, Hispaniola, Jamaica, and Puerto Rico) and the Lesser Antilles (a long arc of smaller islands from the Virgin Islands to Trinidad and Tobago). The Caribbean is one of the most tourism-dependent regions on Earth, with visitor spending accounting for over 15% of GDP in most of its small island economies. It also hosts significant offshore financial centers in the Cayman Islands, British Virgin Islands, and the Bahamas.',
    highlights: [
      'Over 7,000 islands grouped into 13 sovereign nations and a dozen territories.',
      'The most tourism-dependent region in the world, with travel driving 15-90% of GDP.',
      'Cuba is the largest by area and population but remains economically isolated.',
      'Haiti is the poorest country in the Western Hemisphere.'
    ],
    context: 'Cuba\u2019s 11 million people and centrally planned economy make it an outlier \u2014 the largest Caribbean nation but one of its least economically dynamic. Haiti, with 11 million people as well, has been rocked by political instability, natural disasters, and chronic underinvestment, and it ranks as the poorest country in the Americas. The Bahamas and Barbados have higher per capita incomes driven by tourism and financial services. Trinidad and Tobago is unusual in having a substantial petroleum and natural gas sector. The Cayman Islands and British Virgin Islands are among the world\u2019s largest offshore financial centers, hosting thousands of registered companies relative to their populations. The entire region faces growing climate risks from hurricanes, coral bleaching, and sea-level rise.'
  },
  'asia': {
    intro: 'Asia is the largest and most populous continent on Earth, containing 48 sovereign states and around 4.7 billion people \u2014 roughly 60% of the world\u2019s population. The continent spans an enormous range of economies, cultures, and geographies, from the oil-rich Gulf states to the post-industrial economies of Japan and South Korea, from the manufacturing hubs of Southeast Asia to the rapidly growing markets of India and Bangladesh. China and India alone account for over 2.8 billion people \u2014 more than a third of humanity \u2014 and together they represent two of the world\u2019s three largest national economies by purchasing power. The continent is also home to the world\u2019s fastest-growing major economies, the world\u2019s largest sovereign wealth funds, and several of its most severe development challenges.',
    highlights: [
      '48 countries containing 60% of the world\u2019s population.',
      'China and India together have 2.8 billion people \u2014 over a third of humanity.',
      'Japan and South Korea are global technology and manufacturing leaders.',
      'Southeast Asia\u2019s ASEAN bloc has a combined GDP of $3.6 trillion.'
    ],
    context: 'China\u2019s $18 trillion economy is the world\u2019s second-largest, and its manufacturing sector produces about 28% of global output. India, with a $3.5 trillion economy and a median age of 28, is the world\u2019s fastest-growing major economy and home to the largest number of young workers of any country. Japan, despite stagnant growth over three decades, remains the world\u2019s third-largest economy and a pioneer in robotics, automobiles, and materials science. South Korea has transformed from a war-torn nation into a $1.7 trillion high-income economy in three generations. Southeast Asia combines advanced economies like Singapore with rapidly industrializing ones like Vietnam and Indonesia, while Bangladesh and Pakistan struggle with rapid population growth and infrastructure gaps.'
  },
  'europe': {
    intro: 'Europe is a continent of 44 sovereign states stretching from the Atlantic Ocean to the Ural Mountains, and from the Mediterranean Sea to the Arctic Ocean. Despite its small land area compared to Asia or Africa, Europe has been one of the most globally influential continents \u2014 home to the industrial revolution, the Enlightenment, both world wars, and 27 of the world\u2019s advanced economies. It has the highest population density of any continent, with about 750 million people concentrated into 10 million square kilometers. The European Union binds 27 of its countries into the world\u2019s largest single market, though the UK\u2019s departure in 2020 reshaped both the EU and the continent\u2019s political landscape. Europe\u2019s population is aging faster than any other region outside East Asia, and its economic and social systems remain global models for welfare state design.',
    highlights: [
      '750 million people in 44 countries \u2014 the world\u2019s most densely populated continent.',
      'The EU\u2019s 27 members form the world\u2019s largest single market with 450 million consumers.',
      'Germany\u2019s $4.5 trillion economy is the continent\u2019s largest and the world\u2019s fourth-largest.',
      'Europe\u2019s median age is over 44 years \u2014 the oldest population of any continent.'
    ],
    context: 'Germany, France, the United Kingdom, and Italy form the continent\u2019s economic core, together generating roughly two-thirds of EU GDP. Germany\u2019s export-oriented industrial economy is particularly dominant in machinery, automobiles, and chemicals. France combines a strong services sector with significant agricultural and aerospace industries. The UK, post-Brexit, remains a major financial and services center but has faced weaker growth than many of its former EU partners. The Nordic countries \u2014 Sweden, Norway, Denmark, Finland, and Iceland \u2014 consistently rank at the top of global indices for quality of life, innovation, and social trust. Eastern Europe, led by Poland, has grown rapidly since joining the EU in 2004 and is now a major manufacturing base. Southern European economies like Spain, Italy, and Greece have recovered unevenly from the 2008-2012 debt crisis.'
  },
  'africa': {
    intro: 'Africa is the world\u2019s second-largest continent by both area and population, comprising 54 sovereign states and around 1.4 billion people. It is the youngest continent by demographic composition \u2014 the median age is about 19 \u2014 and it is projected to account for the majority of global population growth through the rest of the 21st century. Africa\u2019s diversity is staggering: from the oil exporters of the Gulf of Guinea to the agricultural economies of the Sahel, from the mineral wealth of southern Africa to the rapidly urbanizing cities of East Africa. The continent holds some of the world\u2019s largest reserves of cobalt, gold, diamonds, platinum, and uranium. Despite abundant natural resources, Africa\u2019s share of global GDP remains around 3%, and many of its countries continue to face challenges with infrastructure, political stability, and human development.',
    highlights: [
      '54 countries with 1.4 billion people \u2014 the world\u2019s youngest population.',
      'The continent holds roughly 30% of the world\u2019s mineral reserves.',
      'Nigeria, Egypt, and South Africa account for about half of Africa\u2019s GDP.',
      'Rapid urbanization \u2014 several African cities are among the world\u2019s fastest-growing.'
    ],
    context: 'Nigeria has Africa\u2019s largest economy and its biggest population at over 220 million people, driven substantially by oil exports but increasingly by services and technology. Egypt is the second-largest economy and a critical player in North African and Middle Eastern affairs. South Africa, the continent\u2019s most industrialized economy, is rich in minerals and hosts one of the world\u2019s most important financial centers in Johannesburg. Kenya and Ethiopia have emerged as major East African hubs for technology and manufacturing respectively. However, the continent\u2019s aggregate economic picture masks enormous diversity \u2014 some countries have per capita incomes comparable to Europe while others remain among the poorest in the world. Debt burdens, infrastructure gaps, and the effects of climate change continue to shape the continent\u2019s trajectory.'
  }
};
