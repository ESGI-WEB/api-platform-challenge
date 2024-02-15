<?php

namespace App\Repository;

use App\Enum\RolesEnum;
use Doctrine\ORM\Tools\Pagination\Paginator;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    private function findEmployeesQuery(User $provider, array $order = ['by' => 'id', 'order' => 'ASC']): Query
    {
        $providerOrganisationIds = $provider->getOrganisations()->map(fn ($organisation) => $organisation->getId())->toArray();
        return $this->createQueryBuilder('user')
            ->join('user.organisations', 'organisation')
            ->andWhere('user.id != :id')
            ->setParameter('id', $provider->getId())
            ->andWhere('organisation.id IN (:organisations)')
            ->setParameter('organisations', $providerOrganisationIds)
            ->andWhere('CAST(user.roles AS string) LIKE :role_employee')
            ->setParameter('role_employee', '%' . RolesEnum::EMPLOYEE->value . '%')
            ->andWhere('CAST(user.roles AS string) NOT LIKE :role_provider')
            ->setParameter('role_provider', '%' . RolesEnum::PROVIDER->value . '%')
            ->orderBy('user.' . $order['by'], $order['order'])
            ->getQuery();
    }

    public function findEmployees(User $provider, array $order = ['by' => 'id', 'order' => 'ASC']): array
    {
        return $this->findEmployeesQuery($provider, $order)->getResult();
    }

    public function findEmployeesPaginated(User $provider, int $page = 1, int $limit = 10, array $order = ['by' => 'id', 'order' => 'ASC']): Paginator
    {
        $query = $this->findEmployeesQuery($provider, $order);
        $query->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
        return new Paginator($query);
    }

    public function findProvidersToValidate(array $order = ['by' => 'id', 'order' => 'ASC']): array
    {
        return $this->findProvidersToValidateQuery($order)->getResult();
    }

    public function findProvidersToValidateQuery(array $order = ['by' => 'id', 'order' => 'ASC']): Query {
        return $this->createQueryBuilder('user')
            ->andWhere('CAST(user.roles as string) LIKE :role_provider_to_validate')
            ->setParameter('role_provider_to_validate', '%' . RolesEnum::PROVIDER_TO_VALIDATE->value . '%')
            ->getQuery();
    }

    public function findProvidersToValidatePaginated(int $page = 1, int $limit = 10, array $order = ['by' => 'id', 'order' => 'ASC']): Paginator
    {
        $query = $this->findProvidersToValidateQuery($order);
        $query->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
        return new Paginator($query);
    }

    public function findEmployeeAndProviderByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('user')
            ->andWhere('user.email = :email')
            ->setParameter('email', $email)
            ->andWhere('CAST(user.roles AS string) LIKE :role_employee OR CAST(user.roles AS string) LIKE :role_provider')
            ->setParameter('role_employee', '%' . RolesEnum::EMPLOYEE->value . '%')
            ->setParameter('role_provider', '%' . RolesEnum::PROVIDER->value . '%')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
