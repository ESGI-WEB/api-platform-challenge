<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231015172151 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE answer_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE appointment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE feedback_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE feedback_choices_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE holiday_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE organisation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE schedule_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE service_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE answer (id INT NOT NULL, feedback_id INT NOT NULL, appointment_id INT NOT NULL, answer VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_DADD4A25D249A887 ON answer (feedback_id)');
        $this->addSql('CREATE INDEX IDX_DADD4A25E5B533F9 ON answer (appointment_id)');
        $this->addSql('COMMENT ON COLUMN answer.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE appointment (id INT NOT NULL, client_id INT NOT NULL, provider_id INT NOT NULL, service_id INT NOT NULL, datetime TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(20) DEFAULT \'valid\' NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_FE38F84419EB6921 ON appointment (client_id)');
        $this->addSql('CREATE INDEX IDX_FE38F844A53A8AA ON appointment (provider_id)');
        $this->addSql('CREATE INDEX IDX_FE38F844ED5CA9E6 ON appointment (service_id)');
        $this->addSql('COMMENT ON COLUMN appointment.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE feedback (id INT NOT NULL, service_id INT NOT NULL, question VARCHAR(255) NOT NULL, type VARCHAR(20) NOT NULL, is_mandatory BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D2294458ED5CA9E6 ON feedback (service_id)');
        $this->addSql('COMMENT ON COLUMN feedback.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE feedback_choices (id INT NOT NULL, feedback_id INT NOT NULL, choice VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9497B69AD249A887 ON feedback_choices (feedback_id)');
        $this->addSql('CREATE TABLE holiday (id INT NOT NULL, provider_id INT NOT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, datetime_start TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, datetime_end TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_DC9AB234A53A8AA ON holiday (provider_id)');
        $this->addSql('COMMENT ON COLUMN holiday.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE organisation (id INT NOT NULL, uuid UUID NOT NULL, name VARCHAR(255) NOT NULL, latitude NUMERIC(20, 16) NOT NULL, longitude NUMERIC(20, 16) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN organisation.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE organisation_user (organisation_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(organisation_id, user_id))');
        $this->addSql('CREATE INDEX IDX_CFD7D6519E6B1585 ON organisation_user (organisation_id)');
        $this->addSql('CREATE INDEX IDX_CFD7D651A76ED395 ON organisation_user (user_id)');
        $this->addSql('CREATE TABLE schedule (id INT NOT NULL, provider_id INT NOT NULL, day VARCHAR(10) NOT NULL, hours JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5A3811FBA53A8AA ON schedule (provider_id)');
        $this->addSql('COMMENT ON COLUMN schedule.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE service (id INT NOT NULL, organisation_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E19D9AD29E6B1585 ON service (organisation_id)');
        $this->addSql('COMMENT ON COLUMN service.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, provider_validated BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE answer ADD CONSTRAINT FK_DADD4A25D249A887 FOREIGN KEY (feedback_id) REFERENCES feedback (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE answer ADD CONSTRAINT FK_DADD4A25E5B533F9 FOREIGN KEY (appointment_id) REFERENCES appointment (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F84419EB6921 FOREIGN KEY (client_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F844A53A8AA FOREIGN KEY (provider_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F844ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D2294458ED5CA9E6 FOREIGN KEY (service_id) REFERENCES service (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE feedback_choices ADD CONSTRAINT FK_9497B69AD249A887 FOREIGN KEY (feedback_id) REFERENCES feedback (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE holiday ADD CONSTRAINT FK_DC9AB234A53A8AA FOREIGN KEY (provider_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE organisation_user ADD CONSTRAINT FK_CFD7D6519E6B1585 FOREIGN KEY (organisation_id) REFERENCES organisation (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE organisation_user ADD CONSTRAINT FK_CFD7D651A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE schedule ADD CONSTRAINT FK_5A3811FBA53A8AA FOREIGN KEY (provider_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE service ADD CONSTRAINT FK_E19D9AD29E6B1585 FOREIGN KEY (organisation_id) REFERENCES organisation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE answer_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE appointment_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE feedback_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE feedback_choices_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE holiday_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE organisation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE schedule_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE service_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE answer DROP CONSTRAINT FK_DADD4A25D249A887');
        $this->addSql('ALTER TABLE answer DROP CONSTRAINT FK_DADD4A25E5B533F9');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F84419EB6921');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F844A53A8AA');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F844ED5CA9E6');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT FK_D2294458ED5CA9E6');
        $this->addSql('ALTER TABLE feedback_choices DROP CONSTRAINT FK_9497B69AD249A887');
        $this->addSql('ALTER TABLE holiday DROP CONSTRAINT FK_DC9AB234A53A8AA');
        $this->addSql('ALTER TABLE organisation_user DROP CONSTRAINT FK_CFD7D6519E6B1585');
        $this->addSql('ALTER TABLE organisation_user DROP CONSTRAINT FK_CFD7D651A76ED395');
        $this->addSql('ALTER TABLE schedule DROP CONSTRAINT FK_5A3811FBA53A8AA');
        $this->addSql('ALTER TABLE service DROP CONSTRAINT FK_E19D9AD29E6B1585');
        $this->addSql('DROP TABLE answer');
        $this->addSql('DROP TABLE appointment');
        $this->addSql('DROP TABLE feedback');
        $this->addSql('DROP TABLE feedback_choices');
        $this->addSql('DROP TABLE holiday');
        $this->addSql('DROP TABLE organisation');
        $this->addSql('DROP TABLE organisation_user');
        $this->addSql('DROP TABLE schedule');
        $this->addSql('DROP TABLE service');
        $this->addSql('DROP TABLE "user"');
    }
}
