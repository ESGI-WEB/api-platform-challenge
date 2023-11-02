<?php

namespace App\Repository;

use App\Entity\Holiday;
use DateTime;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Holiday>
 *
 * @method Holiday|null find($id, $lockMode = null, $lockVersion = null)
 * @method Holiday|null findOneBy(array $criteria, array $orderBy = null)
 * @method Holiday[]    findAll()
 * @method Holiday[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HolidayRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Holiday::class);
    }

    public function findByDateTimeBetween(
        DateTimeImmutable|DateTime $begin,
        DateTimeImmutable|DateTime $end,
        array $criteria
    ): array {
        $qb = $this->createQueryBuilder('holidays');
        $qb->where('holidays.datetimeEnd >= :begin')
            ->andWhere('holidays.datetimeStart <= :end')
            ->setParameter('begin', $begin)
            ->setParameter('end', $end);

        foreach ($criteria as $key => $value) {
            if (is_array($value)) {
                $qb->andWhere("holidays.$key IN (:{$key})")
                    ->setParameter("{$key}", $value);
            } else {
                $qb->andWhere("holidays.$key = :$key")
                    ->setParameter($key, $value);
            }
        }

        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return Holiday[] Returns an array of Holiday objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('h.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Holiday
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
