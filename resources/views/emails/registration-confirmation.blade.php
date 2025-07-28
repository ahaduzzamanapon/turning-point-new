<x-mail::message>
# Registration Confirmation

Dear {{ $student->candidate_full_name }},

Your registration with Turning Point Job Aid has been successfully completed!

Here are your registration details:
- **Student ID:** {{ $student->student_id }}
- **Course Interested:** {{ $student->course_interested }}
- **Batch Interested:** {{ $student->bach_interested }}
- **Email:** {{ $student->email }}
- **Mobile Number:** {{ $student->mobile_number }}

We are excited to have you join our program. Our team will contact you shortly with further instructions and access to your course materials.

Thank you for choosing Turning Point Job Aid.

Best regards,
The Turning Point Job Aid Team
</x-mail::message>