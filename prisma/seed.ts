import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const words = [
    'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
    'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
    'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER',
    'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE',
    'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
    'BACON', 'BADGE', 'BAKER', 'BALER', 'BALMY', 'BANAL', 'BANJO', 'BARON',
    'BATCH', 'BEACH', 'BEADS', 'BEAST', 'BEAUT', 'BEGAN', 'BEIGE', 'BELIE',
    'BELLS', 'BENDS', 'BERRY', 'BIBLE', 'BISON', 'BLANK', 'BLEND', 'BLIMP',
    'BLISS', 'BLOOM', 'BOARD', 'BOAST', 'BOOTH', 'BOUND', 'BOWEL', 'BOXER',
    'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BRIBE', 'BRIEF', 'BRING', 'BROIL',
    'BROOK', 'BROWN', 'BUDDY', 'BUGGY', 'BUILD', 'BUNCH', 'BURNT', 'BUYER',
    'CABIN', 'CACHE', 'CAKES', 'CANDY', 'CARED', 'CARES', 'CARET', 'CARGO',
    'CARVE', 'CASES', 'CATER', 'CHAIN', 'CHAIR', 'CHANT', 'CHART', 'CHASE',
    'CHEAP', 'CHEAT', 'CHECK', 'CHEER', 'CHESS', 'CHEST', 'CHICK', 'CHILD',
    'CHIME', 'CHOIR', 'CHOKE', 'CHORD', 'CHURN', 'CIVIL', 'CLAIM', 'CLASS',
    'CLEAN', 'CLEAR', 'CLIMB', 'CLONE', 'CLOUD', 'COAST', 'COLOR', 'COMBO',
    'COMET', 'COMIC', 'COOLY', 'CORAL', 'CORER', 'CORNY', 'COSTS', 'COUGH',
    'COUNT', 'COUPE', 'CRAFT', 'CRANK', 'CRISP', 'CROSS', 'CROWN', 'CRUST',
    'CURSE', 'CYCLE', 'DAILY', 'DAIRY', 'DANCE', 'DANDY', 'DARKS', 'DATES',
    'DEALS', 'DEALT', 'DEBAR', 'DEBIT', 'DEBUT', 'DELAY', 'DELVE', 'DEMON',
    'DEPOT', 'DEPTH', 'DESKS', 'DIALS', 'DIARY', 'DIETS', 'DIRTY', 'DISCO',
    'DITCH', 'DIVER', 'DOING', 'DOORS', 'DOUBT', 'DOUGH', 'DRAFT', 'DRAIN',
    'DREAD', 'DRIED', 'DRILL', 'DRINK', 'DRIVE', 'DROPS', 'DRUMS', 'DRUNK',
    'DUKES', 'DUSTS', 'EARLY', 'EARNS', 'EARTH', 'EBONY', 'ECOLE', 'EDGER',
    'EDICT', 'EDITS', 'ELDER', 'ELECT', 'ELITE', 'ELVES', 'EMAIL', 'EMBED',
    'EMPTY', 'ENACT', 'ENEMY', 'ENTER', 'ENTRY', 'EPICS', 'EQUAL', 'ERODE',
    'ERROR', 'ESSAY', 'ETHIC', 'EVENT', 'EXACT', 'EXAMS', 'EXILE', 'EXIST',
    'EXITS', 'EXTRA', 'FABLE', 'FACED', 'FACET', 'FACTS', 'FAINT', 'FAIRY',
    'FALLS', 'FANCY', 'FATAL', 'FAUNA', 'FAULT', 'FEAST', 'FEEDS', 'FENCE',
    'FERNS', 'FETCH', 'FIELD', 'FIGHT', 'FILMS', 'FINAL', 'FINER', 'FIRST',
    'FISHY', 'FIVEY', 'FLAIR', 'FLAME', 'FLAPS', 'FLASK', 'FLATS', 'FLEET',
    'FLOOD', 'FLOUR', 'FLUFF', 'FOCUS', 'FOILS', 'FOLKS', 'FORCE', 'FORMS',
    'FORTS', 'FOUND', 'FOURS', 'FRANK', 'FREAK', 'FRESH', 'FRIED', 'FRUIT',
    'FUELS', 'FUMES', 'FUNNY', 'GAINS', 'GAMER', 'GAMES', 'GENRE', 'GIANT',
    'GIFTS', 'GIVEN', 'GLASS', 'GLIDE', 'GLOVE', 'GOING', 'GRACE', 'GRADE',
    'GRAIN', 'GRAPE', 'GRAVE', 'GREEN', 'GRILL', 'GROSS', 'GROUP', 'GUARD',
    'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'GUILT', 'HABIT', 'HAIRS', 'HAPPY',
    'HARDY', 'HARSH', 'HAUNT', 'HAVEN', 'HEARD', 'HEART', 'HEAVY', 'HELLO',
    'HELPS', 'HONEY', 'HONOR', 'HOPES', 'HORSE', 'HOSTS', 'HOTEL', 'HOVER',
    'HUMID', 'HUMOR', 'HURRY', 'HYENA', 'IDEAL', 'IDIOT', 'IMAGE', 'IMPLY',
    'INDEX', 'INERT', 'INPUT', 'ISSUE', 'ITCHY', 'JACKS', 'JEWEL', 'JOLLY',
    'JUDGE', 'JUICE', 'JUMPY', 'KARMA', 'KNIFE', 'KNOBS', 'KNOWN', 'LABEL',
    'LACKS', 'LARGE', 'LASER', 'LAUGH', 'LAYER', 'LEADS', 'LEARN', 'LEASE',
    'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LEVER', 'LICKS', 'LIGHT', 'LIKES',
    'LIMIT', 'LINEN', 'LINUX', 'LIONS', 'LIVER', 'LOBBY', 'LOCAL', 'LOGIC',
    'LOOMS', 'LOOSE', 'LUCKY', 'LUNAR', 'LYRIC', 'MAGIC', 'MAGMA', 'MAJOR',
    'MAKER', 'MAPLE', 'MARCH', 'MATCH', 'MATES', 'MEANS', 'MEANT', 'MEDIA',
    'MEDIC', 'MERIT', 'MINOR', 'MINUS', 'MIXER', 'MOUNT', 'MOUSE', 'MOUTH',
    'MOVER', 'MUSKY', 'NACHO', 'NAMES', 'NEEDS', 'NERDS', 'NEVER', 'NEWER',
    'NODES', 'NORTH', 'NOTES', 'NOVEL', 'NURSE', 'OASIS', 'OCCUR', 'OCEAN',
    'OFFER', 'OMENS', 'OPTIC', 'ORDER', 'OTHER', 'OUTER', 'OVENS', 'OWING',
    'PAIRS', 'PAINT', 'PANEL', 'PANIC', 'PARTY', 'PASTE', 'PATCH', 'PATHS',
    'PEACE', 'PEARL', 'PEERS', 'PESTS', 'PHONE', 'PHOTO', 'PIANO', 'PIECE',
    'PITCH', 'PLANT', 'PLATE', 'PLAYS', 'POINT', 'POLAR', 'PORCH', 'PRACT',
    'PRANK', 'PRIZE', 'PROMO', 'PRONE', 'PRUDE', 'PURSE', 'QUEEN', 'QUEST',
    'QUIET', 'QUOTA', 'QUOTE', 'RADAR', 'RADIO', 'RAISE', 'RANCH', 'RANGE',
    'RATED', 'RATES', 'REACT', 'REBEL', 'RECIP', 'REELS', 'REMIT', 'REPLY',
    'RESET', 'RETRO', 'RIDER', 'RIDES', 'RIGHT', 'ROBOT', 'ROCKS', 'ROLLS',
    'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'RUSHY', 'SAVED', 'SAVES',
    'SCALE', 'SCANS', 'SCENT', 'SCOPE', 'SCORE', 'SCRAP', 'SHEEP', 'SHELF',
    'SHOES', 'SHOOT', 'SHORT', 'SHOWS', 'SHRUB', 'SIGNS', 'SIGHT', 'SILLY',
    'SKILL', 'SKINS', 'SKIRT', 'SLASH', 'SLEEP', 'SLICE', 'SLIME', 'SLOPE',
    'SMALL', 'SMELL', 'SMILE', 'SMOKE', 'SNAKE', 'SNAPS', 'SNOWS', 'SOBER',
    'SOLID', 'SONIC', 'SORRY', 'SOUPS', 'SPACE', 'SPARK', 'SPEAR', 'SPELL',
    'SPEND', 'SPICY', 'SPILL', 'SPINE', 'SPOON', 'SPORT', 'SPRAY', 'SPURS',
    'STAGE', 'STAKE', 'STAMP', 'STAND', 'STARS', 'STATE', 'STAYS', 'STEAL',
    'STEEL', 'STEPS', 'STICK', 'STONE', 'STOOL', 'STORE', 'STORM', 'STOVE',
    'STUDY', 'STYLE', 'SUGAR', 'SUITS', 'SUNNY', 'SUPER', 'SWARM', 'SWING',
    'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEARS', 'TENDS',
    'TENTS', 'TERRY', 'THANK', 'THEFT', 'THEME', 'THIEF', 'THINK', 'THOSE',
    'THREE', 'THUMB', 'THUMB', 'TIRED', 'TOKEN', 'TOMMY', 'TOOTH', 'TORCH',
    'TOUCH', 'TOURS', 'TOXIC', 'TRACE', 'TRADE', 'TRAIN', 'TREAT', 'TREES',
    'TRIAL', 'TRICK', 'TROLL', 'TROOP', 'TRUNK', 'TRUST', 'TRUTH', 'TULIP',
    'TWEET', 'TWICE', 'TWINS', 'UNCLE', 'UNDER', 'UNITY', 'UPSET', 'URBAN',
    'URGES', 'USELY', 'USUAL', 'VAGUE', 'VALID', 'VALUE', 'VAPOR', 'VAULT',
    'VAULT', 'VEGAN', 'VENUS', 'VIRUS', 'VISOR', 'VOICE', 'VOTED', 'VOTES',
    'WAGON', 'WAIVE', 'WAKES', 'WALLS', 'WATER', 'WEARY', 'WEIGH', 'WHERE',
    'WHICH', 'WHILE', 'WHOLE', 'WIDOW', 'WILTS', 'WINDS', 'WINES', 'WISER',
    'WITCH', 'WOMEN', 'WOODS', 'WORDS', 'WORTH', 'WOVEN', 'WRIST', 'YIELD',
    'YOUTH', 'ZEBRA', 'ZONES'
  ];
  

async function main() {
  for (const word of words) {
    await prisma.word.upsert({
      where: { word: word.toLowerCase() },
      update: {},
      create: { word: word.toLowerCase() },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });