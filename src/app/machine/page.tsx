"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

const Page = () => {
  const [textValue, setTextValue] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(textValue);
  };
  const badWordDict = ["fuck", "shit", "hell"];
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6">Welcome to Answering Machine</Typography>
      <Typography variant="h6">
        {"This is an AI voice generator for Twilio."}
      </Typography>
      <Accordion expandIcon={<ArrowDropDownIcon />}>
        <AccordionSummary>
          <Typography variant="h6">{"Here's how it works:"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            <li>
              <Typography>• Type in a phrase and submit</Typography>
            </li>
            <li>
              <Typography>
                • Google will generate an audio clip of an AI voice speaking
                your phrase
              </Typography>
            </li>
            <li>
              <Typography>
                • When it sounds good to you, click the Load to Twilio button to
                load the audio in to a phone number.
              </Typography>
            </li>
            <li>
              <Typography>
                • When it sounds good to you, click the Load to Twilio button to
                load the audio in to a phone number.
              </Typography>
            </li>
            <li>
              <Typography>
                • Call the number and listen to the audio clip.
              </Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <TextField
        id="ai-text-input"
        label="AI Text Input"
        variant="outlined"
        fullWidth
        placeholder="Enter your text here..."
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        error={badWordDict.includes(textValue)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Page;
