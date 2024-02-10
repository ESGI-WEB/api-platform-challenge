<?php

namespace App\Entity;

use App\Repository\FeedbackChoicesRepository;
use Doctrine\ORM\Mapping as ORM;

// TODO To implement if we have time
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
