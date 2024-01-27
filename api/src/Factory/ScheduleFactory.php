<?php

namespace App\Factory;

use App\Entity\Schedule;
use App\Repository\ScheduleRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Schedule>
 *
 * @method        Schedule|Proxy                     create(array|callable $attributes = [])
 * @method static Schedule|Proxy                     createOne(array $attributes = [])
 * @method static Schedule|Proxy                     find(object|array|mixed $criteria)
 * @method static Schedule|Proxy                     findOrCreate(array $attributes)
 * @method static Schedule|Proxy                     first(string $sortedField = 'id')
 * @method static Schedule|Proxy                     last(string $sortedField = 'id')
 * @method static Schedule|Proxy                     random(array $attributes = [])
 * @method static Schedule|Proxy                     randomOrCreate(array $attributes = [])
 * @method static ScheduleRepository|RepositoryProxy repository()
 * @method static Schedule[]|Proxy[]                 all()
 * @method static Schedule[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static Schedule[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static Schedule[]|Proxy[]                 findBy(array $attributes)
 * @method static Schedule[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static Schedule[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class ScheduleFactory extends ModelFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function getDefaults(): array
    {
        return [
            'createdAt' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'day' => self::faker()->dayOfWeek(),
            'hours' => ['09:00', '10:00', '15:00', '17:00'],
            'organisation' => OrganisationFactory::new(),
            'provider' => UserFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Schedule $schedule): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Schedule::class;
    }
}
