<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Repository\FeedbackChoicesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    uriTemplate: '/services/{service_id}/feedbacks/{feedback_id}/choices',
    operations: [
        new GetCollection(), // TODO to secure
    ],
    uriVariables: [
        'service_id' => new Link(
            fromProperty: 'feedback',
            fromClass: Service::class
        ),
        'feedback_id' => new Link(
            fromProperty: 'feedbackChoices',
            fromClass: Feedback::class
        ),
    ],
)]
#[ORM\Entity(repositoryClass: FeedbackChoicesRepository::class)]
class FeedbackChoices
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $choice = null;

    #[ORM\ManyToOne(inversedBy: 'feedbackChoices')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Feedback $feedback = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChoice(): ?string
    {
        return $this->choice;
    }

    public function setChoice(string $choice): static
    {
        $this->choice = $choice;

        return $this;
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
}
