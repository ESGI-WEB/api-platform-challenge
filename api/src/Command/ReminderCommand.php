<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Twilio\Rest\Client;

use function Symfony\Component\DependencyInjection\Loader\Configurator\env;


#[AsCommand(name: 'app:reminder')]
class ReminderCommand extends Command
{
    public function __construct(
        private $sid,
        private $token,
        private $from,
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $twilio = new Client($this->sid, $this->token);

        // We must use user's phone number, but as long as we don't pay Twilio, we can only send messages to our own sandbox phone numbers
        // so for demonstration purposes, we will override with one of our phone number
        // $to = $user->getPhone();

        $to = "whatsapp:+33662304919";
        $twilio->messages
            ->create(
                $to,
                [
                    "from" => $this->from,
                    "body" => "Your appointment is coming up on July 21 at 3PM"
                ]
            );

        return Command::SUCCESS;
    }

    protected function configure(): void
    {
        $this->setDescription('Send reminder emails to users and providers');
    }
}