<?php

namespace App\Repository;

use App\Entity\Appointment;
use App\Entity\User;
use App\Enum\RolesEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @extends ServiceEntityRepository<Appointment>
 *
 * @method Appointment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointment[]    findAll()
 * @method Appointment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        private readonly Security $security
    ) {
        parent::__construct($registry, Appointment::class);
    }

    public function findByDateTimeBetween(
        \DateTimeInterface $startDate,
        \DateTimeInterface $endDate,
        array $criteria = [],
        array $joins = [],
    ): array {
        $qb = $this->createQueryBuilder('a')
            ->andWhere('a.datetime BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        foreach ($joins as $key => [$field, $value]) {
            $fieldSanitized = str_replace('.', '_', $field);
            $qb->join("a.$key", $key)
                ->andWhere("$field = :$fieldSanitized")
                ->setParameter($fieldSanitized, $value);
        }

        foreach ($criteria as $key => $value) {
            $qb->andWhere("a.$key = :$key")
                ->setParameter($key, $value);
        }


        return $qb->getQuery()->getResult();
    }

    public function countAppointments()
    {
        $qb = $this->createQueryBuilder('appointments')
            ->select('count(appointments.id)')
            ->andWhere("appointments.status = 'valid'");

        if (!$this->security->isGranted(RolesEnum::ADMIN)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER)) {
                $qb->innerJoin('appointments.service', 'service')
                    ->innerJoin('service.organisation', 'organisation')
                    ->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else {
                $qb->andWhere('appointments.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        return $qb
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getMostPopularSlot($limit = 1)
    {
        $qb = $this->createQueryBuilder('appointment')
            ->select("date_format(appointment.datetime, 'YYYY-MM-DD HH24:MI TZH:TZM') AS appointment_time")
            ->andWhere("appointment.status = 'valid'")
            ->groupBy('appointment_time')
            ->orderBy('COUNT(appointment.id)', 'DESC')
            ->setMaxResults($limit);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER->value)) {
                $qb->innerJoin('appointment.service', 'service')
                    ->innerJoin('service.organisation', 'organisation')
                    ->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else { // employee
                $qb->andWhere('appointment.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        $result = $qb->getQuery()->getOneOrNullResult();

        return $result ? $result['appointment_time'] : null;
    }

    public function getLastCreatedAppointment($start = null, $end = null, $limit = 5)
    {
        $qb = $this->createQueryBuilder('appointment')
            ->select([
                'appointment.datetime as subtitle',
                "CONCAT(client.lastname, ' ', client.firstname) AS title",
                'organisation.name as description',
                "CONCAT(organisation.address, ' ', organisation.zipcode, ' ', organisation.city) AS subdescription",
            ])
            ->innerJoin('appointment.client', 'client')
            ->innerJoin('appointment.service', 'service')
            ->innerJoin('service.organisation', 'organisation')
            ->andWhere("appointment.status = 'valid'")
            ->orderBy('appointment.createdAt', 'DESC')
            ->setMaxResults($limit);

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER->value)) {
                $qb->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else { // employee
                $qb->andWhere('appointment.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        if ($start) {
            $qb->andWhere('appointment.createdAt >= :start')
                ->setParameter('start', $start);
        }

        if ($end) {
            $qb->andWhere('appointment.createdAt <= :end')
                ->setParameter('end', $end);
        }

        return $qb->getQuery()->getResult();
    }

    public function getNumberOfAppointmentsPerDay($start, $end)
    {
        $qb = $this->createQueryBuilder('appointment')
            ->select([
                "date_format(appointment.datetime, 'YYYY-MM-DD') AS day",
                "COUNT(appointment.id) AS appointment_count",
            ])
            ->andWhere("appointment.status = 'valid'")
            ->andWhere('appointment.datetime BETWEEN :start AND :end')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->groupBy('day');

        if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER->value)) {
                $qb->innerJoin('appointment.service', 'service')
                    ->innerJoin('service.organisation', 'organisation')
                    ->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else { // employee
                $qb->andWhere('appointment.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        return $qb->getQuery()->getResult();
    }

    public function findAppointmentsByOrganisationQuery($organisationId, $userId = null, $filters)
    {
        $qb = $this->createQueryBuilder('appointment')
            ->innerJoin('appointment.service', 'service')
            ->innerJoin('service.organisation', 'organisation')
            ->andWhere('organisation.id = :organisation')
            ->setParameter('organisation', $organisationId);

        if ($userId) {
            $qb->innerJoin('organisation.users', 'users')
                ->andWhere('users.id = :user')
                ->setParameter('user', $userId);
        }

        $orders = ['datetime', 'id'];
        if (isset($filters['order'])) {
            foreach ($filters['order'] as $key => $order) {
                if (in_array($key, $orders)) {
                    $qb->addOrderBy("appointment.{$key}", $order);
                }
            }
        }

        $filtersAllowed = ['status'];
        foreach ($filters as $key => $value) {
            if (in_array($key, $filtersAllowed)) {
                if (is_array($value)) {
                    $qb->andWhere("appointment.{$key} IN (:{$key})")
                        ->setParameter($key, $value);
                } else {
                    $qb->andWhere("appointment.{$key} = :{$key}")
                        ->setParameter($key, $value);
                }
            }
        }

        $dateFilters = ['datetime'];
        foreach ($filters as $key => $value) {
            if (in_array($key, $dateFilters)) {
                if (isset($value['before'])) {
                    $qb->andWhere("appointment.{$key} <= :{$key}_before")
                        ->setParameter("{$key}_before", $value['before']);
                }
                if (isset($value['after'])) {
                    $qb->andWhere("appointment.{$key} >= :{$key}_after")
                        ->setParameter("{$key}_after", $value['after']);
                }
            }
        }

        return $qb->getQuery();
    }

    public function findAppointmentsByOrganisationPaginated($organisationId, $userId = null, $filters, $page, $limit)
    {
        $qb = $this->findAppointmentsByOrganisationQuery($organisationId, $userId, $filters);

        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new Paginator($qb);
    }
}
