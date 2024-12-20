<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'uuid')]
    private Uuid $id;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private Utilisateur $envoyeur;

    #[ORM\ManyToOne(inversedBy: 'messagesRecus')]
    #[ORM\JoinColumn(nullable: false)]
    private Utilisateur $receveur;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $date;

    #[ORM\Column(length: 255)]
    private string $texte;

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getEnvoyeur(): Utilisateur
    {
        return $this->envoyeur;
    }

    public function setEnvoyeur(Utilisateur $envoyeur): static
    {
        $this->envoyeur = $envoyeur;

        return $this;
    }

    public function getReceveur(): Utilisateur
    {
        return $this->receveur;
    }

    public function setReceveur(Utilisateur $receveur): static
    {
        $this->receveur = $receveur;

        return $this;
    }

    public function getDate(): \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTexte(): string
    {
        return $this->texte;
    }

    public function setTexte(string $texte): static
    {
        $this->texte = $texte;

        return $this;
    }
}
