<?php

namespace App\Repository;

use App\Entity\FeedbackChoices;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FeedbackChoices>
 *
 * @method FeedbackChoices|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedbackChoices|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedbackChoices[]    findAll()
 * @method FeedbackChoices[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedbackChoicesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedbackChoices::class);
    }

//    /**
//     * @return FeedbackChoices[] Returns an array of FeedbackChoices objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?FeedbackChoices
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
