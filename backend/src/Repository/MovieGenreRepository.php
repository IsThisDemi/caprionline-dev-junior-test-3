<?php

namespace App\Repository;

use App\Entity\MovieGenre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MovieGenre>
 *
 * @method MovieGenre|null find($id, $lockMode = null, $lockVersion = null)
 * @method MovieGenre|null findOneBy(array $criteria, array $orderBy = null)
 * @method MovieGenre[]    findAll()
 * @method MovieGenre[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieGenreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MovieGenre::class);
    }

    //    /**
    //     * @return MovieGenre[] Returns an array of MovieGenre objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MovieGenre
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    //Get list of films having the genre
    public function findByGenreId(int $genreId, string $orderBy, string $sortBy): array
    {
        $sortFilter = '';
        if ($sortBy === 'recently_uploaded') {
            $sortFilter = 'id';
        } elseif ($sortBy === 'release_date') {
            $sortFilter = 'releaseDate';
        } elseif ($sortBy === 'rating') {
            $sortFilter = 'rating';
        }
        $entityManager = $this->getEntityManager();

        $query = $entityManager->createQueryBuilder()
            ->select('mg.id as movieGenreId, m.id, m.title, g.name, m.imageUrl, m.plot, m.year, m.releaseDate, m.duration, m.rating, m.wikipediaUrl')
            ->from('App\Entity\MovieGenre', 'mg')
            ->innerJoin('mg.movie', 'm')
            ->innerJoin('mg.genre', 'g')
            ->where('mg.genre = :id')
            ->orderBy('m.' . $sortFilter, $orderBy)
            ->setParameter('id', $genreId);
            
        return $query->getQuery()->getResult();
    }
}
