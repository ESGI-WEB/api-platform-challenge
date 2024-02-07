<?php

namespace App\Repository;

use App\Entity\Answer;
use App\Enum\RolesEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @extends ServiceEntityRepository<Answer>
 *
 * @method Answer|null find($id, $lockMode = null, $lockVersion = null)
 * @method Answer|null findOneBy(array $criteria, array $orderBy = null)
 * @method Answer[]    findAll()
 * @method Answer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AnswerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private readonly Security $security)
    {
        parent::__construct($registry, Answer::class);
    }

    private function getAnswersForQuery($user)
    {
        $qb = $this->createQueryBuilder('answer')
            ->innerJoin('answer.appointment', 'appointment')
            ->orderBy('answer.createdAt', 'DESC')
        ;

        if ($this->security->isGranted(RolesEnum::PROVIDER->value)) {
            // il faut verifier que dans la liste des users liés à l'organisation, il y a le provider connecté, en sachant que c'est du many to many
            // pour avoir la liste des feedbacks pour ses orga et pas que ses rdv
            $qb->innerJoin('appointment.service', 'service')
                ->innerJoin('service.organisation', 'organisation')
                ->innerJoin('organisation.users', 'users')
                ->andWhere('users.id = :user') // ce where permet de n'avoir qu'une ligne par feedback donc pas de duplication
                ->setParameter('user', $user);
        } else if ($this->security->isGranted(RolesEnum::EMPLOYEE->value)) {
            // l'employé ne peut voir que ses rdv
            $qb->andWhere('appointment.provider = :user')
                ->setParameter('user', $user);
        } else if (!$this->security->isGranted(RolesEnum::ADMIN->value)) {
            // le client ne peut voir que ses rdv tandis que l'admin peut tout voir
            $qb->andWhere('appointment.client = :user')
                ->setParameter('user', $user);
        }

        return $qb->getQuery();
    }

    public function getAnswersFor($user)
    {
        return $this->getAnswersForQuery($user)->getResult();
    }

    public function getAnswersPaginatedFor($user, $page, $limit)
    {
        $qb = $this->getAnswersForQuery($user)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new Paginator($qb);
    }

    public function getLastFeedbacks($limit = 5)
    {
        $qb = $this->createQueryBuilder('answer')
            ->select([
                "CONCAT(client.lastname, ' ', client.firstname) AS full_name",
                'appointment.datetime as appointment_date',
                'answer.createdAt as feedback_date',
                "CONCAT(organisation.name, ' ', organisation.address, ' ', organisation.zipcode, ' ', organisation.city) AS full_address",
            ])
            ->innerJoin('answer.appointment', 'appointment')
            ->innerJoin('appointment.client', 'client')
            ->innerJoin('appointment.service', 'service')
            ->innerJoin('service.organisation', 'organisation');

        if (!$this->security->isGranted(RolesEnum::ADMIN)) {
            if ($this->security->isGranted(RolesEnum::PROVIDER)) {
                // il faut verifier que dans la liste des users liés à l'organisation, il y a le provider connecté, en sachant que c'est du many to many
                $qb->innerJoin('organisation.users', 'users')
                    ->andWhere('users.id = :user')
                    ->setParameter('user', $this->security->getUser());
            } else { // provider employee
                $qb->andWhere('appointment.provider = :user')
                    ->setParameter('user', $this->security->getUser());
            }
        }

        return $qb
            ->groupBy('appointment.id', 'full_name', 'full_address', 'feedback_date')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
