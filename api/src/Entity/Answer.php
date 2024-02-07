<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Enum\GroupsEnum;
use App\Enum\RolesEnum;
use App\Provider\AnswersProvider;
use App\Repository\AnswerRepository;
use App\Security\Voter\AnswerVoter;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

// un POST appointments/id/feedbacks/id/answer pour ajouter une réponse à un feedback sur un rdv aurait été pas mal
// mais on arrive toujours pas à le faire fonctionner sous un POST
#[ApiResource(
    operations: [
        new GetCollection(
            openapiContext: [
                'description' => 'Get the list of answers. Result depends one the current logged user (if it is an employee, provider, user or admin)',
            ],
            security: 'is_granted("' . RolesEnum::USER->value . '")',
            provider: AnswersProvider::class
        ),
        new GetCollection(
            uriTemplate: '/answers-detailed',
            openapiContext: [
                'description' => 'Get the list of answers with all related data. Result depends one the current logged user (if it is an employee, provider, user or admin)',
            ],
            normalizationContext: ['groups' => [GroupsEnum::ANSWER_READ->value, GroupsEnum::ANSWER_READ_DETAILED->value]],
            security: 'is_granted("' . RolesEnum::USER->value . '")',
            provider: AnswersProvider::class,
        ),
        new Post(securityPostDenormalize: 'is_granted("' . AnswerVoter::CREATE . '", object)'),
    ],
    normalizationContext: ['groups' => [GroupsEnum::ANSWER_READ->value]],
    denormalizationContext: ['groups' => [GroupsEnum::ANSWER_WRITE->value]],
)]
#[ORM\Entity(repositoryClass: AnswerRepository::class)]
class Answer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([GroupsEnum::ANSWER_READ->value])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'answers')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([GroupsEnum::ANSWER_WRITE->value, GroupsEnum::ANSWER_READ_DETAILED->value])]
    private ?Feedback $feedback = null;

    #[ORM\ManyToOne(inversedBy: 'answers')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([GroupsEnum::ANSWER_WRITE->value, GroupsEnum::ANSWER_READ_DETAILED->value])]
    private ?Appointment $appointment = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups([GroupsEnum::ANSWER_READ->value, GroupsEnum::ANSWER_WRITE->value])]
    private ?string $answer = null;

    #[ORM\Column]
    #[Groups([GroupsEnum::ANSWER_READ->value])]
    private DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFeedback(): ?Feedback
    {
        return $this->feedback;
    }

    public function setFeedback(?Feedback $feedback): static
    {
        $this->feedback = $feedback;

        return $this;
    }

    public function getAppointment(): ?Appointment
    {
        return $this->appointment;
    }

    public function setAppointment(?Appointment $appointment): static
    {
        $this->appointment = $appointment;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): static
    {
        $this->answer = $answer;

        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }
}
