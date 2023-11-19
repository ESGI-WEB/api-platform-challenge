<?php

namespace App\Validator;

use App\Entity\Holiday;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class HolidayDateRangeValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (!$value instanceof Holiday) {
            return;
        }

        // Check if there is an overlap with existing holidays for the same provider
        $existingHolidays = $value->getProvider()->getHolidays();
        foreach ($existingHolidays as $existingHoliday) {
            if ($this->isDateRangeOverlap($value, $existingHoliday)) {
                $this->context->buildViolation($constraint->message)
                    ->addViolation();
                break;
            }
        }
    }

    private function isDateRangeOverlap(Holiday $newHoliday, Holiday $existingHoliday): bool
    {
        return $newHoliday->getDatetimeStart() < $existingHoliday->getDatetimeEnd()
            && $newHoliday->getDatetimeEnd() > $existingHoliday->getDatetimeStart();
    }
}
