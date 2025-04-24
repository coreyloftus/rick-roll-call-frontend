import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function About() {
    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                    <Typography variant='h6'>{"Here's how it works:"}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        <li>
                            <Typography>• Type in a phrase and submit</Typography>
                        </li>
                        <li>
                            <Typography>
                                • Google will generate an audio clip of an AI voice speaking your phrase
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                • When it sounds good to you, click the Load to Twilio button to load the audio in to a
                                phone number.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                • When it sounds good to you, click the Load to Twilio button to load the audio in to a
                                phone number.
                            </Typography>
                        </li>
                        <li>
                            <Typography>• Call the number and listen to the audio clip.</Typography>
                        </li>
                    </ul>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
