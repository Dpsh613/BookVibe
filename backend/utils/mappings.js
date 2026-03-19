// This is the "brain" of BookVibe. Gutendex doesn't know what "Dark" or "Victorian" means. We have to map your app's concepts to Gutendex's topic and author lifespan parameters.

const moodToTopic = {
  reflective: ["philosophy", "psychology", "poetry"],
  nostalgic: ["childhood", "fairy tales", "humor"],
  dark: ["gothic", "horror", "mystery", "detective"],
  romantic: ["romance", "love"],
  escapist: ["adventure", "science", "fantasy"],
  // we can search all the genres gutendex has and then distribute them among the moods
};

const eraToYears = {
  victorian: { start: 1800, end: 1901 },
  roaring: { start: 1880, end: 1930 },
  ancient: { start: -2000, end: 500 }, // BCE to early AD
};

export { moodToTopic, eraToYears };
