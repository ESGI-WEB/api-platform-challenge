<?php

namespace App\Repository;

use App\Entity\Organisation;
use App\Enum\RolesEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @extends ServiceEntityRepository<Organisation>
 *
 * @method Organisation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Organisation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Organisation[]    findAll()
 * @method Organisation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrganisationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private readonly Security $security)
    {
        parent::__construct($registry, Organisation::class);
    }


    public function getOrganisationsWithMoreAppointments($start = null, $end = null, $limit = 5)
    {
        $qb = $this->createQueryBuilder('organisation')
            ->select([
                'organisation.name as subtitle',
                "COUNT(appointments.id) AS title",
                'organisation.address as description',
                "CONCAT(organisation.zipcode, ' ', organisation.city) AS subdescription",
            ])
            ->innerJoin('organisation.services', 'services')
            ->innerJoin('services.appointments', 'appointments')
            ->groupBy('organisation.id')
            ->andWhere("appointments.status = 'valid'")
            ->orderBy('title', 'DESC')
            ->setMaxResults($limit);

        if (!$this->security->isGranted(RolesEnum::ADMIN)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER)) {
                $qb->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else {
                $qb->andWhere('appointments.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        if ($start) {
            $qb->andWhere('appointments.datetime >= :start')
                ->setParameter('start', $start);
        }

        if ($end) {
            $qb->andWhere('appointments.datetime <= :end')
                ->setParameter('end', $end);
        }

        return $qb->getQuery()->getResult();
    }
}
