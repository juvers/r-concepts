export interface AuthorProps {
  name: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  countryOfBirth?: string;
}

export const getAuthorProps = (
  author?: Pick<
    GatsbyTypes.SanityArtAuthor,
    'name' | 'nationality' | 'birthYear' | 'deathYear' | 'countryOfBirth'
  >,
): AuthorProps => {
  if (!author) throw new Error('Expected valid authors data');

  if (!author?.name) throw new Error('Expected valid author name');
  if (!author?.nationality)
    throw new Error('Expected valid author nationality');
  if (!author?.birthYear) throw new Error('Expected valid author birth year');

  return {
    name: author.name,
    nationality: author.nationality,
    birthYear: author.birthYear,
    deathYear: author?.deathYear,
    countryOfBirth: author?.countryOfBirth,
  };
};
