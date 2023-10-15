<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Enum\FeedbackTypeEnum;
use App\Repository\FeedbackRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    uriTemplate: '/services/{id}/feedbacks',
    operations: [
        new GetCollection(), // TODO to secure
    ],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'feedback',
            fromClass: Service::class
        )
    ],
)]
#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
class Feedback
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Service $service = null;

    #[ORM\Column(length: 255)]
    private ?string $question = null;

    #[Assert\Choice(callback: [FeedbackTypeEnum::class, 'values'])]
    #[ORM\Column(length: 20)]
    private ?string $type = null;

    #[ORM\Column]
    private ?bool $isMandatory = null;

    #[ORM\OneToMany(mappedBy: 'feedback', targetEntity: Answer::class, orphanRemoval: true)]
    private Collection $answers;

    #[ORM\Column]
    private DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'feedback', targetEntity: FeedbackChoices::class, orphanRemoval: true)]
    private Collection $feedbackChoices;

    public function __construct()
    {
        $this->answers = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
        $this->feedbackChoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function isIsMandatory(): ?bool
    {
        return $this->isMandatory;
    }

    public function setIsMandatory(bool $isMandatory): static
    {
        $this->isMandatory = $isMandatory;

        return $this;
    }

    /**
     * @return Collection<int, Answer>
     */
    public function getAnswers(): Collection
    {
        return $this->answers;
    }

    public function addAnswer(Answer $answer): static
    {
        if (!$this->answers->contains($answer)) {
            $this->answers->add($answer);
            $answer->setFeedback($this);
        }

        return $this;
    }

    public function removeAnswer(Answer $answer): static
    {
        if ($this->answers->removeElement($answer)) {
            // set the owning side to null (unless already changed)
            if ($answer->getFeedback() === $this) {
                $answer->setFeedback(null);
            }
        }

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

    /**
     * @return Collection<int, FeedbackChoices>
     */
    public function getFeedbackChoices(): Collection
    {
        return $this->feedbackChoices;
    }

    public function addFeedbackChoice(FeedbackChoices $feedbackChoice): static
    {
        if (!$this->feedbackChoices->contains($feedbackChoice)) {
            $this->feedbackChoices->add($feedbackChoice);
            $feedbackChoice->setFeedback($this);
        }

        return $this;
    }

    public function removeFeedbackChoice(FeedbackChoices $feedbackChoice): static
    {
        if ($this->feedbackChoices->removeElement($feedbackChoice)) {
            // set the owning side to null (unless already changed)
            if ($feedbackChoice->getFeedback() === $this) {
                $feedbackChoice->setFeedback(null);
            }
        }

        return $this;
    }
}
