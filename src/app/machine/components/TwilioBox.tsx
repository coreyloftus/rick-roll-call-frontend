import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

export default function TwilioBox() {
    const consentLanguageText =
        "You understand that by inputting text into the provided box and initiating the service, you are requesting and consenting to receive an automated phone call to the number you provide. This call will play an audio message generated from the text you submitted using Google Gemini's Text-to-Audio service.You acknowledge that this service is a personal software engineering project and not a commercial or official service. You understand that standard message and data rates from your mobile carrier may apply to the call you receive. You confirm that the phone number you provide is your own and that you have the legal right to receive calls at that number. You also agree not to use this service for any unlawful, harmful, or abusive purposes, including but not limited to harassment, spam, or impersonation. Your use of this service is at your own risk. The developer of this project is not responsible for any issues or damages that may arise from your use of the service."
    const checkBoxLabelText = 'I agree to the terms and conditions of Twilio integration.'
    return (
        <Box className='twilio-box'>
            <Typography variant='h2'>Twilio Integration</Typography>
            <Typography>{consentLanguageText}</Typography>

            <Typography variant='body1'>
                Please check the box below to confirm your consent to use the Twilio integration.
            </Typography>

            <FormGroup>
                <Typography variant='body1'></Typography>
                <FormControlLabel required control={<Checkbox />} label={checkBoxLabelText} />
            </FormGroup>
        </Box>
    )
}
