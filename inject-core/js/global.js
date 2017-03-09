// UI
// ----------------------------------------------

// var IMAGE_WIDTH_ARTICLE = 60;
// var IMAGE_WIDTH_WIKIPEDIA = 40;

var TEST_ENVIRONMENT = false;
var TWITTER = true;
var PRESSER = false;

// API Keys
// ----------------------------------------------


var JUICER_API_KEY = "Wq8CsZK0zZqNoPZwVbxe8HjqM146OuEx";
//    var apiKey = "c63jxWGoAxiftAJh9V01qtTHxUS9Jf1T";
var MASHAPE_KEY = 'jGOEsrunUOmshZv3ahQRsuyWV0n7p1FLmhcjsnemmDR0s0bvTH';
var AYLIEN_NEWS_APP_KEY = '2f0d4ccc3b223a29b4dd503a391f4af6';
var AYLIEN_NEWS_APP_ID = 'c68d4c83';
var DIFFBOT_KEY = '69c310732cec4ecbbed606308a811a1f';
var PRESSER_API_KEY = 'Wq8CsZK0zZqNoPZwVbxe8HjqM146OuEx';
var GOOGLE_SEARCH_KEY = 'AIzaSyDBkWpX_NEM-ZZe3UZf7n3Y02jucPM2YTY';
var GOOGLE_SEARCH_CX = '015225533164441069233:wuhyk8dpvce';

// API Urls
// ----------------------------------------------

var JUICER_URL = "https://kzachos-juicer-v1.p.mashape.com/articles";
var WIKIPEDIA_URL = "https://kzachos-wikipedia-v1.p.mashape.com/api.php";
var EDDIE_URL = "https://kzachos-textbooster-v1.p.mashape.com/eddie/";
var YQLQUERY = 'https://query.yahooapis.com/v1/public/yql?q=';
var MANGO_URL = 'https://kzachos-mango-v1.p.mashape.com/topics';
var RAMEN_URL = 'http://api.ramen.virt.ch.bbc.co.uk/';
var CARTOON_URL = "https://kzachos-cartoons-v1.p.mashape.com/json_search";
var AYLIEN_NEWS_URL = "https://api.newsapi.aylien.com/api/v1/";
var DIFFBOT_URL = 'http://api.diffbot.com/v3/';
var TWITTER_URL = 'https://kzachos-twitter-v1.p.mashape.com/tweets';
var PRESSER_URL = 'https://kzachos-presser-v1.p.mashape.com/articles';
var GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1?';


// JUICER API parameters
// ----------------------------------------------

var JUICER_SIZE_PARAMETER = 200;
var JUICER_LANG_PARAMETER = 'en';
var JUICER_SORT_BY_RECENT_PARAMETER = false;
var ALL_SOURCES = false;
var DEFAULT_SOURCE_ARRAY = [
    [
        ['Main British Isles'],
        [1],
        [
            '1' // BBC News
            , '3' // Sky News
            , '8' // The Guardian
            , '10' // The Independent
            , '11' // The Huffington Post
            , '14' // The Irish Times
            , '20' // Irish Independent
            , '23' // The Scotsman
            , '41' // Financial Times
            , '42' // The Daily Telegraph
            , '71' // New Statesman
            , '72' // Reuters News
            , '85' // The Economist
            , '86' // Newsweek
            , '184' // Independent Ireland
            , '266' // Times Education Supplement
            , '385' // BBC Mundo
        ]
    ],
    [
        ['Tabloid British Isles'],
        [2],
        [
            '12' // The Mirror
            , '16' // The Irish Sun
            , '19' // The Irish Daily Star
            , '22' // Daily Record
            , '40' // Metro
            , '43' // Daily Mail
            , '45' // Daily Express
            , '46' // Daily Star
            , '70' // The Sun
            , '182' // Irish Daily Star
            , '361' // Farming Life
        ]
    ],
    [
        ['Main Regional British Isles'],
        [3],
        [
            '4' // Birmingham Mail
            , '15' // Belfast Telegraph
            , '25' // Yorkshire Post
            , '26' // Yorkshire Evening Post
            , '44' // London Evening Standard
            , '47' // South Wales Evening Post
            , '58' // Manchester Evening News
            , '180' // Irish Examiner [CORK]
            , '264' // Herald Scotland [GLASGOW]
        ]
    ],
    [
        ['Europe'],
        [4],
        [
            '299' // EuroFora [EU]
            , '303' // The Local Newspaper [Sweden' //  Germany' //  France' //  Spain etc.]
            , '298' // Connexion Newspaper [FRANCE]
            , '301' // Le Monde Diplomatique [FRANCE]
            , '79' // Friedl News Newspaper (Austria)
            , '80' // New Europe (Belgium)
            , '447' // Copenhagen Post [DENMARK]
            , '304' // Der Spiegel International [GERMANY]
            , '306' // Ekathimerini [GREECE]
            , '309' // Dutch News [HOLLAND]
            , '354' // Krakow Post [POLAND]
            , '356' // Portugal Resident [PORTUGAL]
            , '456' // Budapest Business Journal [HUNGARY]
            , '458' // News of Iceland [ICELAND]
            , '451' // Finnbay Newspaper [FINLAND]
            , '445' // North Cyprus Daily [CYPRUS]
            , '446' // Prague Daily Monitor [CZECH REPUBLIC]
            , '392' // El Mundo [SPAIN]
            , '393' // El Pais [SPAIN]
            , '397' // Cinco Dias [SPAIN]
        ]
    ],
    [
        ['USA'],
        [5],
        [
            '73' // Los Angeles Times [USA]
            , '74' // The Washington Post
            , '89' // The New York Times
            , '90' // The Wall Street Journal
            , '300' // International Herald Tribune [International New York Times]
            , '363' // Chicago Tribune [USA]
            , '369' // CNN [USA]
            , '370' // CNN Money [USA]
            , '371' // Fox News [USA]
            , '372' // Bloomberg [USA]
            , '373' // Forbes [USA]
            , '381' // ABC News [USA]
            , '382' // U.S. News and World Report
            , '383' // The Onion [USA]
            , '384' // Newsmax Media [USA]
            , '87' // The Daily Beast
        ]
    ],
    [
        ['Canada'],
        [6],
        [
            '78' // The Globe and Mail [CANADA]
            , '288' // Toronto Star [CANADA]
        ]
    ],
    [
        ['Australia'],
        [7],
        [
            '76' // The Sydney Morning Herald [AUSTRALIA]
            , '285' // The Daily Telegraph (Australia)
            , '272' // Herald Sun [SYDNEY]
            , '281' // The Courier-Mail [BRISBANE]
        ]
    ],
    [
        ['New Zealand'],
        [8],
        [
            '318' // Dominion Post [NZ]
            , '325' // New Zealand Herald [NZ]
            , '331' // Otago Daily Times [NZ]
            , '450' // Fiji Live [FIJI]
        ]
    ],
    [
        ['Asia'],
        [9],
        [
            '82' // Peoples Daily [CHINA]
            , '91' // The Jakarta Post [INDONESIA]
            , '95' // Bangkok Post [THAILAND]
            , '308' // South China Morning Post [HONG KONG]
            , '438' // Bhutan Observer [BHUTAN]
        ]
    ],
    [
        [' India'],
        [10],
        [
            '432' // Financial Express [INDIA]
            , '459' // Business Standard [INDIA]
            , '464' // Economic Times [INDIA]
            , '468' // The Hindu
            , '471' // The Indian Express
            , '472' // Live Mint [INDIA]
        ]
    ],
    [
        ['Middle East'],
        [11],
        [
            '357' // Gulf Times [QATAR]
            , '440' // Brunei Times [BRUNEI]
            , '424' // Pajhwok Afghan News [AFGHANISTAN]
        ]
    ],
    [
        ['Russia'],
        [12],
        [
            '358' // Gazeta.Ru [RUSSIA]
            , '360' // Russia Today [RUSSIA]
            , '422' // Moscow Times [RUSSIA]
            , '429' // Azer News [AZERBAIJAN]
            , '430' // Eurasianet [KAZAKHSTAN]
            , '435' // Svobodnye Novosti Plus [BELARUS]
            , '453' // Civil Daily News [GEORGIA]
            , '427' // Hetq [ARMENIA]
            , '428' // Pan Armenian Newspaper [ARMENIA]
        ]
    ],
    [
        ['South America'],
        [13],
        [
            '389' // Le Nacion [ARGENTINA]
            , '426' // Buenos Aires Herald [ARGENTINA]
            , '436' // Belize Times [BELIZE]
            , '439' // The Rio Times [BRAZIL]
            , '442' // Latin American Post [COLUMBIA]
            , '443' // Costa Rica Star [COSTA RICA]
            , '455' // Honduras News [HONDURAS]
        ]
    ],
    [
        ['Caribbean'],
        [14],
        [
            '425' // Antigua Observer [ANTIGUA]
            , '433' // Barbados Today [BARBADOS]
            , '437' // Royal Gazette [BERMUDA]
            , '454' // Guyana Chronicle [GUYANA]
            , '448' // Dominica Weekly [DOMINICA]
            , '449' // Dominican Today [DOMINICAN REPUBLIC]
        ]
    ],
    [
        ['Africa'],
        [15],
        [
            '31' // Daily News Egypt
            , '132' // The Punch [NIGERIA]
            , '137' // Business Day Live [SOUTH AFRICA]
            , '151' // Independent Newspaper [SOUTH AFRICA]
            , '155' // Mail and Guardian [SOUTH AFRICA]
        ]
    ],
];
var PUBLISHED_AFTER = '2016-03-03T00:00:00.000Z';



// YQL Tokens
// ----------------------------------------------

var CONSUMER_KEY = 'dj0yJmk9SGFhSFphc2dCV2FpJmQ9WVdrOWNFRlhRM0pNTkRnbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wOQ--';
var CONSUMER_SECRET = '16cece7c8d577ef70756a939d0a0211f2682eaa4';


// Twitter Tokens (Name: TwitterJournalism)
// ----------------------------------------------

var CONSUMER_KEY = '1Zz9z8J3Uwlxrxhj1f6uQD920';
var CONSUMER_SECRET = 'lgcQtBUaDdbgUqNfDwCJovsOSZ2BQxKjOiG1S4QRWl1vOVvCPx';
var ACCESS_TOKEN = '134770074-9wBxG0gk2L9pPYWk33bUxkQmrbq6l17RAdX278Up';
var ACCESS_TOKEN_SECRET = 'lZaALeVkmv7JsMdZ47nvuvMDnKFgE4PgQ73Vc85ZNNMAU';




// Individual Dimension stuff
// ----------------------------------------------

var THRESHOLD_QUERY_PERCENTAGE_INDIVIDUALS = 30;
var MAX_NUMBER_INDIVIDUALS = 10;
var MAX_NUMBER_RESULTS_PER_INDIVIDUAL = 4;
var MAX_RESULTS_PERSON = 8;
var MAX_LENGTH_WIKIPEDIA = 150;
var MAX_LENGTH_BODYEXTRACT = 140;
var NUMBER_OF_PARAGRAPHS_PERSON_CONCEPT = 0;

var CONCEPT_CONTENT = 'Also think about other types of people for your human angle, from';
var CONCEPT_ARRAY = new Array("Comedians",
    "Pop artists",
    "Classical music artists",
    "Politicians",
    "Current sportspersons",
    "Retired sportspersons",
    "Trades union leaders",
    "Military historians",
    "Television journalists",
    "Print journalists",
    "Entrepreneurs",
    "Sculptors",
    "Artists",
    "Naturalists",
    "Aristocrats",
    "Social media celebrities",
    "Academics",
    "Bon viveurs",
    "Religious leaders",
    "Military leaders",
    "Common persons",
    "Authors",
    "Film makers",
    "Sex workers",
    "TV documentary makers",
    "Rock stars",
    "Scientists",
    "Winners of a Nobel Prize",
    "Refuges",
    "Child stars",
    "Company directors",
    "Someone who died in current year",
    "Engineers",
    "Designers",
    "Television pundits",
    "Medical doctors",
    "Medical nurses",
    "Psychologists",
    "Psychiatrists",
    "Sociologists",
    "Business owners",
    "Surgeons",
    "Author and novelists",
    "Explorers",
    "Financial analysts",
    "Cartoonists",
    "Satirists",
    "Police officers",
    "Chefs and bakers",
    "Architects",
    "Social planners",
    "Town planners",
    "Environmental activists",
    "Data scientists",
    "Political lobbyists",
    "Geographers and geologers",
    "Photographers",
    "Philanthropists"
);



// Evidence Dimension stuff
// ----------------------------------------------

var EVIDENCE_DATA_ARRAY = [
    [
        ['Economy'],
        ['Gross Domestic Product', 'GDP ', 'Gross National Product', 'GNP ', 'National Income', 'Economic Growth', 'Interest Rate', 'Nominal GDP forecast', 'Real GDP forecast', 'GDP long-term forecast', 'Investment forecast', 'Domestic demand forecast', 'OECD ', 'Current account balance', 'Main Economic Indicators', 'Composite leading indicator', 'Value-added in financial corporations', 'Value-added in non-financial corporations', 'Financial corporations debt to equity ratio', 'Non-Financial corporations debt to surplus ratio', 'Banking sector leverage', 'Value added by activity', 'Net national income', 'Net lending by sector', 'Saving rate', 'Net borrowing by sector', 'FDI stocks', 'FDI flows', 'FDI restrictiveness', 'Foreign direct investment', 'FDI ', 'Household disposable income', 'Household spending', 'Household savings', 'Household savings forecast', 'Household debt', 'Household financial assets', 'Household financial transactions', 'Household net worth', 'Trade in goods and services', 'Trade in goods and services forecast', 'Trade in goods', 'Trade in services', 'Current account balance', 'Current account balance forecast', 'Exports by business size', 'Imports by business size', 'Terms of trade', 'Domestic value added in gross exports', 'Composite leading indicator', 'CLI ', 'Business confidence index', 'BCI ', 'Consumer confidence index', 'CCI ', 'Value added by activity', 'Net national income', 'Saving rate', 'Net lending', 'Net borrowing', 'Gross National Income', 'GNI ', 'Share prices', 'Inflation', 'CPI ', 'Producer price indices', 'PPI ', 'Price level indices', 'Inflation forecast', 'GDP per hour worked', 'Labour productivity forecast', 'Labour productivity and utilisation', 'Labour compensation per hour worked', 'Multifactor productivity', 'Unit labour costs']
    ],
    [
        ['Finance'],
        ['us dollar', 'USD', 'dollar', '\\$', 'EUR', 'euro', '€', 'british pound', 'GBP', 'pound', 'sterling', '£', 'japanese yen', 'JPY', 'yen', '¥', 'australian dollar', 'AUD', 'canadian dollar', 'CAD', 'chinese yuan', 'CNY', 'yuan', 'swedish krona', 'SEK', 'krona', 'kr', 'russian ruble', 'RUB', 'ruble', '_', 'norwegian krone', 'NOK', 'krone', 'swiss franc', 'CHF', 'franc', 'Fr', 'Purchasing power parities', 'PPP', 'Exchange rates', 'Insurance spending', 'National insurance market share', 'Insurance spending', 'Gross insurance premiums', 'Gross direct insurance premiums', 'National insurance market share', 'Insurance activity indicator', 'Short-term interest rates', 'Long-term interest rates', 'Long-term interest rates forecast', 'Short-term interest rates forecast', 'Net pension replacement rates', 'Net pension wealth', 'Gross pension replacement rates', 'Gross pension wealth', 'Pension funds\' assets', 'Private pension assets']
    ],
    //[['Health'],['Doctors\' consultations','Child vaccination rates','Influenza vaccination rates','Caesarean sections','Length of hospital stay','Hospital discharge rates','Computed tomography exams','CT exams','Magnetic resonance imaging exams','MRI exams','Hospital beds','Computed tomography scanners','CT scanners','Magnetic resonance imaging units','MRI units','Mammography machines','Radiotherapy equipment','Health spending','Pharmaceutical spending','Medical graduates','Nursing graduates','Body Mass Index','BMI ','National Death Index','NDI ','Daily smokers','Alcohol consumption','Overweight population','Obese population','Life expectancy at birth','Life expectancy at 65','Infant mortality rates','Potential years of life lost','Deaths from cancer','Suicide rates']],
    //[['Education'],['Education spending','Spending on tertiary education','Teaching hours','Teachers\' salaries','Public spending on education','Private spending on education','Number of students','Mathematics performance','PISA','Science performance','Reading performance','Population with tertiary education','Adult education level','Enrolment rate','Graduation rate',"'Youth not in employment, education or training'",'NEET']],
    //[['Environment'],['Air and GHG emissions','Forest resources','Municipal waste','Water withdrawals','Waste water treatment']],
    //[['Agriculture'],['Crop production','Meat consumption','Agricultural support','Producer protection','Nutrient balance','Agricultural land']],
    //[['Government'],['General government deficit','General government revenue','General government spending','General government spending by destination','General government debt','General government financial wealth','Government production costs','Government reserves','Central government spending','Tax revenue','Tax on personal income','Tax on corporate profits','Social security contributions','Tax on payroll','Tax on property','Tax on goods and services','Tax wedge']],
    //[['Society'],['Population','Working age population','Young population','Elderly population','Fertility rates','Income inequality','Poverty rate','Poverty gap','Discriminatory family code','Violence against women','Women Political Voice','Social Institutions and Gender','Permanent immigrant inflows','Foreign-born population','Foreign population','Native-born employment','Foreign-born employment','Native-born unemployment','Foreign-born unemployment','Native-born participation rates','Foreign-born participation rates','Stocks of foreign-born population in OECD countries','National population distribution','Urban population by city size','National area distribution','Social spending','Pension spending','Public unemployment spending','Family benefits public spending','Social benefits to households','Public spending on incapacity','Public spending on labour markets']],
    //[['Jobs'],['Salary','Earning','Wage','Pay gap','Increase','Paid on average','Gender pay gap','Average wages','Employee compensation by activity','Gender wage gap','Wage levels','Unemployment rate','Unadjusted rate','Adjusted rate','Jobless rate','Unemployment  ','Down from','Up from','Stands at','jobs ','job hunting','labour force','Employment rate','Employment rate by age group','Employment by education level','Employment by activity','Part-time employment rate','Self-employment rate','Temporary employment','Labour force','Labour force forecast','Labour force participation rate','Hours worked','Harmonised unemployment rate (HUR)','Unemployment rate','Unemployment rates by education level','Long-term unemployment rate','Youth unemployment rate']],
    [
        ['Measurement Units'],
        ['percentage ', 'percent ', 'nanometer', "'millimeter, mm'", ' mm ', "'centimeter, cm'", ' cm ', 'inch', 'foot', 'feet', 'yard', 'meter', ' m ', 'kilometer', ' km ', 'salt pan', 'mile', 'visvia', 'megalight', 'light year', 'degree', 'celcius', 'nanosecond', 'microsecond', 'second', 'sec ', 'minute', 'min ', 'hour', ' h ', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'microgram', 'milligram', 'gram', 'kilogram', 'metric ton', 'pound', 'kilometer per hour', 'km/h', 'sangen', 'milibar', 'pint', 'gallon', 'litre', 'cubic meter', 'm3 ', 'cubic kilometer', 'km3 ', 'square meter', 'm2 ', 'joule', 'megajoule', 'gigaton', 'watt', 'gigawatt', 'Energy Unit', 'Power Unit', 'microhertz', 'terahertz']
    ],
    [
        ['Numbers'],
        [',100', ',110', ',120', ',130', ',140', ',150', ',160', ',170', ',180', ',190', ',210', ',220', ',230', ',240', ',250', ',260', ',270', ',280', ',290', ',300', ',310', ',320', ',330', ',340', ',350', ',360', ',370', ',380', ',390', ',400', ',410', ',420', ',430', ',440', ',450', ',460', ',470', ',480', ',490', ',500', ',510', ',520', ',530', ',540', ',550', ',560', ',570', ',580', ',590', ',600', ',610', ',620', ',630', ',640', ',650', ',660', ',670', ',680', ',690', ',700', ',710', ',720', ',730', ',740', ',750', ',760', ',770', ',780', ',790', ',800', ',810', ',820', ',830', ',840', ',850', ',860', ',870', ',880', ',890', ',900', ',910', ',920', ',930', ',940', ',950', ',960', ',970', ',980', ',990', ',000', ',010', ',020', ',030', ',040', ',050', ',060', ',070', ',080', ',090', 'millions', 'million ', 'thousands', 'thousand ', 'dozens', 'dozen ', 'billions', 'billion ', 'hundreds', 'hundred ']
    ]
];


// Causal Dimension stuff
// ----------------------------------------------

var THRESHOLD_CAUSAL_PERCENTAGE = 10;
var THRESHOLD_ARTICLE_LENGTH = 600;


var BOOSTER_ARTICLE_LENGTH_OVER2000 = 6;
var BOOSTER_ARTICLE_LENGTH_OVER1500 = 5;
var BOOSTER_ARTICLE_LENGTH_OVER1000 = 4;
var BOOSTER_ARTICLE_LENGTH_900_999 = 3;
var BOOSTER_ARTICLE_LENGTH_800_899 = 2;
var BOOSTER_ARTICLE_LENGTH_700_799 = 1;
var BOOSTER_ARTICLE_LENGTH_600_699 = 0;
var BOOSTER_ARTICLE_LENGTH_DEFAULT = 0;

var CAUSAL_TERMS = [
    [
        [' cause'],
        [4]
    ],
    [
        [' causing'],
        [4]
    ],
    [
        [' led to '],
        [3]
    ],
    [
        [' impact'],
        [3]
    ],
    [
        [' effect'],
        [3]
    ],
    [
        [' since'],
        [2]
    ],
    [
        [' result'],
        [2]
    ],
    [
        [' significant'],
        [2]
    ],
    [
        [' link'],
        [2]
    ],
    [
        [' study'],
        [2]
    ],
    [
        [' studies'],
        [2]
    ],
    [
        [' contribute'],
        [1]
    ],
    [
        [' contribution'],
        [1]
    ],
    [
        [' contributing'],
        [1]
    ],
    [
        [' evidence'],
        [1]
    ],
    [
        [' follow'],
        [1]
    ],
    [
        [' compare'],
        [1]
    ],
    [
        [' comparative'],
        [1]
    ],
    [
        [' expert'],
        [1]
    ],
    [
        [' why'],
        [1]
    ],
    [
        [' affect'],
        [1]
    ],
    [
        [' research'],
        [1]
    ]
];


var CAUSAL_DATA_ARRAY = [
    [
        ['Terms'],
        ['in earlier years', 'in previous years', 'impact', ' led to', ' cause', 'the result of', 'the reason for', 'correlation', 'evidence', 'cause and effect', 'root cause', 'beginning', 'explanation', 'end result', 'why', 'cause of', 'timeline', 'because']
    ],
];

var CAUSAL_PRIORITY_TERMS = new Array(
    ' cause',
    'impact',
    'evidence',
    'reason',
    ' led to',
    'why',
    'because'
);

var CAUSAL_SOURCES = new Array(
    '85' // The Economist
    , '41' // Financial Times
    , '90' // The Wall Street Journal
    , '372' // Bloomberg [USA]
    , '89' // The New York Times
    , '72' // Reuters News
    , '10' // The Independent
    , '8' // The Guardian
    , '43' // Daily Mail
);



// Description:	Since + Valid years from 1900 to 2099
// Matches	since 2000 | since 2003 | Since 1992-93
var regexTimePeriod1 = new RegExp(/(since|in|since the beginning of|since early|since late|before|prior to|until|up until|at the beginning of|at the start of|after|not long after|soon after|shortly after|during) (?:19|20)\d{2}/ig);

// Description:	Since + Month
// Matches	since June | since January
var regexTimePeriod2 = new RegExp(/(since|in|since the beginning of|since early|since late|before|prior to|until|up until|at the beginning of|at the start of|after|not long after|soon after|shortly after|during) (?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber)/ig);

// Description:	Since the + Month + Day
// Matches	since the June 23 | since the January 25
var regexTimePeriod3 = new RegExp(/since the (?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber) ([1-9]|[12][0-9]|3[01])/ig);

// Description:	From YYYY-YY
// Matches	from 2000-01
var regexTimePeriod4 = new RegExp(/from (?:19|20)\d{2}-\d{2}/ig);

// Description:	From YYYY-YYYY
// Matches	from 2000-2001
var regexTimePeriod5 = new RegExp(/from (?:19|20)\d{2}-(?:19|20)\d{2}/ig);

// Description:	From MMM to MMM
// Matches	from June to July
var regexTimePeriod6 = new RegExp(/from (?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber) to (?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber)/ig);

// Description:	(Summer|Winter|Autumn|Fall|Spring) of YYYY
// Matches	Summer of 2001 | Spring of 1999
var regexTimePeriod7 = new RegExp(/(Summer|Winter|Autumn|Fall|Spring) of (?:19|20)\d{2}/ig);

// Description:	(in the past|In the preceding) X years
// Matches	in the past 4 years | in the preceding five years
var regexTimePeriod8 = new RegExp(/(in the past|In the preceding) ([2-9]|[1-9][0-9]|[1-9][0-9][0-9]|(two|three|four|five|six|seven|eight|nine|ten)) years/ig);


var allRegexTimePeriodsArray = [
    regexTimePeriod1,
    regexTimePeriod2,
    regexTimePeriod3,
    regexTimePeriod4,
    regexTimePeriod5,
    regexTimePeriod6,
    regexTimePeriod7,
    regexTimePeriod8
];

// var allRegexTimePeriods = new RegExp(
//                               regexTimePeriod1b.source
//                      + "|" + regexTimePeriod2b.source
//                      + "|" + regexTimePeriod3b.source
//                      + "|" + regexTimePeriod4b.source
//                      + "|" + regexTimePeriod5b.source
//                      + "|" + regexTimePeriod6b.source
//                      + "|" + regexTimePeriod7b.source
//                      + "|" + regexTimePeriod8b.source
//                     , "ig");



// Description: This RE validates dates in the dd MMM yyyy format. Spaces separate the values.
// Matches:	31 January 2003 | 29 March 2004 | 29 Feb 2008
var regexDate1 = new RegExp(/((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})/g);

// Description This RE validate the full name of the months.
// Matches	January | May | October
// var regexDate2 = new RegExp(/(?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber)/);
var regexDate2 = new RegExp(/(?:J(anuary|u(ne|ly))|February|March|A(pril|ugust)|(((Sept|Nov|Dec)em)|Octo)ber)/g);

// Description	Mathces in format DD-MON-YYYY (hyphen between results). Validates for leap years. Ensures month is in uppercase.
// Matches	9-MAY-1981 | 29-FEB-2004 | 25-DEC-1999
var regexDate3 = new RegExp(/((31(?! (FEB|APR|JUN|SEP|NOV)))|((30|29)(?! FEB))|(29(?= FEB (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])-(JAN|FEB|MAR|MAY|APR|JUL|JUN|AUG|OCT|SEP|NOV|DEC)-((1[6-9]|[2-9]\d)\d{2})/g);

// Description	The following validates dates with and without leading zeros in the following formats: MM/DD/YYYY and it also takes YYYY (this can easily be removed). All months are validated for the correct number of days for that particular month except for February which can be set to 29 days. date day month year
// Matches	01/01/2001 | 1/01/2001 | 2002
// Non-Matches	2/30/2002 | 13/23/2002 | 12345
var regexDate4 = new RegExp(/((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}/g);

// Description  european date formats like "10.02.2012" or "10-02-2012"
var regexDate5 = new RegExp(/([1-9]|0[1-9]|[12][0-9]|3[01])[-\.]([1-9]|0[1-9]|1[012])[-\.](19|20)\d\d/g);

// Description	dd/MM/yyyy with leap years 100% integrated Valid years : from 1600 to 9999 As usual, many tests have been made. I think this one should be fine.
// Matches	29/02/2000 | 30/04/2003 | 01/01/2003
// Non-Matches	29/02/2001 | 30-04-2003 | 1/1/2003
var regexDate6 = new RegExp(/(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((1[6-9]|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((1[6-9]|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((1[6-9]|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))/g);

// Description	Valid years from 1900 to 2099
// Matches	2000 | 2003 | 1992
// Non-Matches	1823 | 2100
var regexDate7 = new RegExp(/(?:19|20)\d{2}/g);


var allRegexDatesArray = [
    regexDate1,
    regexDate2,
    regexDate3,
    regexDate4,
    regexDate5,
    regexDate6,
    regexDate7
];

// var allRegexDates = new RegExp(
//                               regexDate1b.source
//                       + "|" + regexDate2b.source
//                       + "|" + regexDate3b.source
//                       + "|" + regexDate4b.source
//                       + "|" + regexDate5b.source
//                       + "|" + regexDate6b.source
//                       + "|" + regexDate7b.source
//                       , "g");





// Quirky Dimension stuff
// ----------------------------------------------
var CARTOON_PREFIX = "http://www.cartoonmovement.com";


// Notification Messages
// ----------------------------------------------
var PLACEHOLDER_SEARCH_BOX = 'Enter keyword(s) or use \'Insert Text\' button';
var NOTIFICATION_STATUS_NO_KEYWORDS = 'To receive sources of inspiration, either highlight some text in your article and click \'Insert Text\' button or type one term at a time, followed by Enter. Then click on your chosen inspiration strategy';
var NOTIFICATION_STATUS_TOO_MANY_KEYWORDS = 'You have entered a lot for JUICE to investigate. For better results, remove one or more terms before clicking your inspiration strategy. Or use Advanced Features at the bottom of the sidebar to request Relaxed inspiration';
var NOTIFICATION_STATUS_RAMIFICATION_DIMENSION = '<b>Ramification</b> feature not available yet - coming soon!';
var NOTIFICATION_STATUS_VISUALISATION_DIMENSION = '<b>Visualisation</b> feature not available yet - coming soon!';
var NOTIFICATION_LARGE_CHUNK_HIGHLIGHTED = 'JUICE can work with this amount of text, but it will find better sources of inspiration less text input. Try selecting and using less text';
var NOTIFICATION_INSERT_NO_SELECTION = 'To use text from your article directly to seek sources of inspiration, first highlight some text, then press the ICON';
var NOTIFICATION_INSERT_NO_SELECTION2 = 'Please select some text or enter a query in the text area.';
var NOTIFICATION_INSERT_NO_EDDIE_SELECTION = 'Selected text cannot be parsed. Only noun and verb phrases can be used. Alternatively, enter terms directly as keyword(s)';
// var NOTIFICATION_INSERT_NO_EDDIE_SELECTION = 'Selected text cannot be parsed. Enter directly as keyword(s)';
var NOTIFICATION_NO_RESULTS = 'Your search did not match any results. Try different, more general, or fewer keywords';

// Generic
// ----------------------------------------------
// var DIALOG_TITLE = '';
var SIDEBAR_TITLE = 'JUICE';

var TWITTER_LANG_PARAMETER = 'en';

var MAX_NUMBER_RESULTS_DIMENSION_TOTAL = 40;
var MAX_NUMBER_RESULTS_DIMENSION_PER_PAGE = 10;

var MAX_NUMBER_TOOLTIPS = 5;

var THRESHOLD_QUERY_PERCENTAGE = 20;

var THRESHOLD_RATIO_TERMS = 0.1;
var REDUCER_RATIO_TERMS = 0; // between 0 and 1

var MULTIPLIER_TITLE_ORIGINAL_TERMS = 3;
var MULTIPLIER_TITLE_EXPANDED_TERMS = 1;
var MULTIPLIER_BODY_ORIGINAL_TERMS = 2;
var MULTIPLIER_BODY_EXPANDED_TERMS = 1;

var BOOSTER_TITLE_ALL_ORIGINAL_TERMS = 8;
var BOOSTER_BODY_ALL_ORIGINAL_TERMS = 3;


// Colors ----------------------------------------------
var COLORS = ['#34B297', '#FB6107', '#8EA604', '#FFBA08', '#A4508B', '#92AD94', '#C97064'];
