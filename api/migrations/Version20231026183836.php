<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231026183836 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE holiday ADD organisation_id INT NOT NULL');
        $this->addSql('ALTER TABLE holiday ADD CONSTRAINT FK_DC9AB2349E6B1585 FOREIGN KEY (organisation_id) REFERENCES organisation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_DC9AB2349E6B1585 ON holiday (organisation_id)');
        $this->addSql('ALTER TABLE schedule ADD organisation_id INT NOT NULL');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FB9E6B1585 FOREIGN KEY (organisation_id) REFERENCES organisation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_5A3811FB9E6B1585 ON schedule (organisation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE schedule DROP CONSTRAINT FK_5A3811FB9E6B1585');
        $this->addSql('DROP INDEX IDX_5A3811FB9E6B1585');
        $this->addSql('ALTER TABLE schedule DROP organisation_id');
        $this->addSql('ALTER TABLE holiday DROP CONSTRAINT FK_DC9AB2349E6B1585');
        $this->addSql('DROP INDEX IDX_DC9AB2349E6B1585');
        $this->addSql('ALTER TABLE holiday DROP organisation_id');
    }
}
