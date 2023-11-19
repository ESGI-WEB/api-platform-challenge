<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class HolidayDateRange extends Constraint
{
    public string $message = 'There is an existing holiday within the selected date range.';
}
