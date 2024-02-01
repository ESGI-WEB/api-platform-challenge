<?php

namespace App\Services;

use App\Entity\User;
use Mailjet\Client;
use Mailjet\Resources;
readonly class EmailService
{

    private const MJ_TEMPLATE_ID = 5638120;

    public function __construct(private string $mailjetAPIKey, private string $mailjetSecretKey)
    {}

    public function sendValidationEmail(String $emailAdmin, User $newProvider): array
    {

        $mj = new Client($this->mailjetAPIKey, $this->mailjetSecretKey, true, ['version' => 'v3.1']);

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "e-commissariat@mail.com",
                        'Name' => "E-commissariat"
                    ],
                    'To' => [
                        [
                            'email' => $emailAdmin,

                        ]
                    ],
                    'TemplateID' => self::MJ_TEMPLATE_ID,
                    'TemplateLanguage' => true,
                    'Subject' => "Valider un nouveau commissaire",
                    'Variables' => [
                        'firstname' => $newProvider->getFirstName(),
                        'lastname' => $newProvider->getLastName(),
                        'phone' => $newProvider->getPhone() ?? "Non renseigné",
                        'email' => $newProvider->getEmail(),
                        'link' => "https://img.freepik.com/photos-gratuite/portrait-chien-isole-blanc-cree-aide-ia-generative_60438-2499.jpg?size=338&ext=jpg&ga=GA1.1.1788068356.1706745600&semt=ais",
                    ],
                ]
            ]
        ];

        $response = $mj->post(Resources::$Email, ['body' => $body]);
        return $response->getData();
    }

}