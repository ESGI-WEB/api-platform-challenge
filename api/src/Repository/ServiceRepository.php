<?php

namespace App\Repository;

use App\Entity\Service;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Service>
 *
 * @method Service|null find($id, $lockMode = null, $lockVersion = null)
 * @method Service|null findOneBy(array $criteria, array $orderBy = null)
 * @method Service[]    findAll()
 * @method Service[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Service::class);
    }

    private function getServicesGroupedByQuery($by)
    {
        $qb = $this->createQueryBuilder('s')
            ->select('s.' . $by)
            ->groupBy('s.' . $by)
            ->orderBy('s.' . $by, 'ASC');

        return $qb->getQuery();
    }

    public function getServicesGroupedBy($by)
    {
        return $this->getServicesGroupedByQuery($by)->getResult();
    }

    public function getPaginatedServicesGroupedBy($by, $page, $limit)
    {
        $qb = $this->getServicesGroupedByQuery($by)
            ->setFirstResult($limit * ($page - 1))
            ->setMaxResults($limit);
        return new Paginator($qb);
    }
}
