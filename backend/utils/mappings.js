// This is the "brain" of BookVibe. Gutendex doesn't know what "Dark" or "Victorian" means. We have to map your app's concepts to Gutendex's topic and author lifespan parameters.

const moodToTopic = {
  reflective: ["philosophy", "psychology", "poetry", "essays", "didactic"],
  nostalgic: ["childhood", "fairy tales", "humor", "folklore", "historical fiction"],
  dark: ["gothic", "horror", "detective", "mystery", "crime", "ghost stories"],
  romantic: ["romance", "love stories", "man-woman relationships"],
  escapist: ["adventure", "science fiction", "fantasy", "mythology", "sea stories"],
};

const eraToYears = {
  // Homer and Plato, Shakespeare, Dante and early philosophers
  victorian: { start: 1900, end: 1950 },
  // The absolute golden age of the classic novel (Austen, Dickens, Dostoevsky, Poe)
  roaring: { start: 1800, end: 1899 },
  //  Captures the Roaring 20s, early modernism, pulp fiction, and the Lost Generation
  ancient: { start: -3000, end: 1799 }, // BCE to early AD
};

export { moodToTopic, eraToYears };
