<?php

namespace App\Services;

use App\Entity\Appointment;
use App\Entity\Organisation;
use App\Enum\AppointmentStatusEnum;
use App\Repository\AppointmentRepository;
use Twilio\Rest\Client;

readonly class SmsService
{
    public function __construct(
        private string $twilioSID,
        private string $twilioToken,
        private string $twilioFrom,
        private string $frontUrl,
        private AppointmentRepository $appointmentRepository,
    ) { }

    public function sendUserAppointmentReminders(): void
    {
        // get all appointments for tomorrow
        $appointments = $this->appointmentRepository->findByDateTimeBetween(
            new \DateTimeImmutable('tomorrow'),
            new \DateTimeImmutable('tomorrow + 1 day'),
            [
                'status' => AppointmentStatusEnum::valid->value,
            ],
        );

        $employees = [];
        foreach ($appointments as $appointment) {
            $employee = $appointment->getProvider();
            $client = $appointment->getClient();

            if (isset($employees[$employee->getId()])) {
                $employees[$employee->getId()]['appointments'][] = $appointment;
            } else {
                $employees[$employee->getId()] = [
                    'employee' => $employee,
                    'appointments' => [$appointment],
                ];
            }

            if (!$client->getPhone()) {
                continue;
            }

            /** @var Organisation $station */
            $station = $appointment->getService()->getOrganisation();
            $this->sendSms(
                $client->getPhone(),
                "Bonjour {$client->getFirstName()} {$client->getLastName()},\n" .
                "N'oubliez pas votre rendez-vous demain à {$appointment->getDatetime()->format('H:i')} avec {$employee->getFirstName()} {$employee->getLastName()}.\n" .
                "Vous pouvez consultez votre rendez-vous et les documents à apporter via ce lien : " . $this->frontUrl . "/appointment/" . $appointment->getId() . "\n\n" .
                "Adresse :\n" .
                "{$station->getName()}\n" .
                "{$station->getAddress()}\n" .
                "{$station->getZipCode()} {$station->getCity()}\n"
            );
        }

        foreach ($employees as $employee) {
            if (!$employee['employee']->getPhone()) {
                continue;
            }
            $this->sendSms(
                $employee['employee']->getPhone(),
                "Bonjour {$employee['employee']->getFirstName()} {$employee['employee']->getLastName()},\n" .
                "Voici vos rendez-vous de demain :\n" .
                implode("\n", array_map(fn ($appointment) =>
                    "- {$appointment->getClient()->getFirstName()} {$appointment->getClient()->getLastName()} à {$appointment->getDatetime()->format('H:i')} au commissariat : {$appointment->getService()->getOrganisation()->getName()}"
                    , $employee['appointments'])) . "\n"
            );
        }
    }

    public function sendNewAppointmentNotification(Appointment $appointment): void
    {
        $employee = $appointment->getProvider();
        $client = $appointment->getClient();

        if (!$employee->getPhone()) {
            return;
        }

        $this->sendSms(
            $employee->getPhone(),
            "Bonjour {$employee->getFirstName()} {$employee->getLastName()},\n" .
            "Vous avez un nouveau rendez-vous avec {$client->getFirstName()} {$client->getLastName()} le {$appointment->getDatetime()->format('d/m/Y à H:i')}.\n" .
            "Le sujet du rendez-vous est : {$appointment->getService()->getTitle()}\n" .
            "Commissariat : {$appointment->getService()->getOrganisation()->getName()}\n" .
            "Vous pouvez consulter le rendez-vous via ce lien : " . $this->frontUrl . "/appointment/" . $appointment->getId() . "\n",
        );
    }

    private function sendSms($to, $message): void
    {
        // We must use user's phone number ($to), but as long as we don't pay Twilio, we can only send messages to our own sandbox phone numbers
        // so for working demonstration purposes, we will override with one of our phone number
        $to = "whatsapp:+33661517171";

        try {
            $twilio = new Client($this->twilioSID, $this->twilioToken);

            $twilio->messages
                ->create(
                    $to,
                    [
                        "from" => $this->twilioFrom,
                        "body" => $message
                    ]
                );
        } catch (\Exception $e) {
            // Do nothing as we don't want to break the app if Twilio is down
            // But we should log the error by something like Sentry
        }
    }
}
